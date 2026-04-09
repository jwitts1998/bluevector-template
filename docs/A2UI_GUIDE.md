# A2UI Integration Guide

**Version**: 1.0.0
**Last Updated**: March 2026

## Overview

A2UI (Agent-to-UI) is an open-source UI toolkit for LLM-generated interfaces. It enables agents to send structured, declarative UI descriptions to client applications via streaming JSONL, which clients render using their native widget libraries.

### Why A2UI?

Traditional UIs are designed by humans and coded statically. A2UI enables **AI-first interfaces** where the agent dynamically decides what UI to show based on context, user state, and conversation history. The interface adapts in real-time as the agent learns more about what the user needs.

### Core Philosophy

- **Declarative over imperative**: Components described as data, not code
- **AI controls what, client controls how**: Agent decides the structure; client applies styling and native rendering
- **Progressive rendering**: Stream components as they're ready
- **Security by default**: Widget Registry as a closed catalog
- **Framework-agnostic**: Same protocol works for React, Flutter, Angular, web components

### Relationship to Existing Stack

A2UI complements (does not replace) the existing agent UI tools:

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Vercel AI SDK | Text/chat streaming | Conversational interactions |
| assistant-ui | Chat thread UI | ChatGPT-style message threads |
| flutter_chat_ui | Flutter chat rendering | Mobile chat threads |
| tool-ui | Tool result display | Inline structured results in chat |
| xyflow | Graph visualization | Agent workflow DAGs |
| **A2UI** | **Structured agent UI** | **Dynamic forms, dashboards, panels** |

---

## Architecture

### Three Pillars

```
┌─────────────────────────────────────────────────┐
│                   A2UI System                    │
├───────────────┬──────────────┬──────────────────┤
│ Component Tree│  Data Model  │ Widget Registry  │
│  (Structure)  │   (State)    │   (Catalog)      │
│               │              │                  │
│ Server sends  │ Server sends │ Client defines   │
│ what to render│ dynamic vals │ how to render    │
│               │              │                  │
│ surfaceUpdate │dataModelUpdate│ Native widgets  │
└───────────────┴──────────────┴──────────────────┘
```

### Message Flow

```
Server (Agent/LLM)                    Client (React/Flutter)
       │                                      │
       │──── surfaceUpdate ──────────────────>│  Buffer components
       │──── surfaceUpdate ──────────────────>│  Buffer more
       │──── dataModelUpdate ────────────────>│  Buffer data
       │──── beginRendering ─────────────────>│  Render UI
       │                                      │
       │<──── userAction (REST POST) ────────│  User interacts
       │                                      │
       │──── dataModelUpdate ────────────────>│  Update data
       │──── surfaceUpdate ──────────────────>│  Update component
       │                                      │
       │──── surfaceDeletion ────────────────>│  Remove surface
```

### Surfaces

A Surface is a named UI region identified by `surfaceId`. One stream can control multiple surfaces:

- `main` — Primary content area
- `sidebar` — Supplementary information
- `modal-{id}` — Overlays and dialogs
- `chat-msg-{id}` — Embedded surfaces within chat messages

Each surface has its own component tree and data model.

---

## Quick Start

### Minimal React Setup

**1. Widget Registry** (`src/a2ui/registry.ts`)

```typescript
import { ComponentType } from 'react';

export interface A2UIProps {
  id: string;
  data: Record<string, unknown>;
  children?: React.ReactNode;
  onAction?: (action: { action: string; context: Record<string, unknown> }) => void;
}

export const registry: Record<string, ComponentType<A2UIProps>> = {
  Text: ({ data }) => <span>{String(data.text ?? '')}</span>,
  Button: ({ data, onAction }) => (
    <button onClick={() => onAction?.({ action: String(data.actionName), context: {} })}>
      {String(data.label ?? '')}
    </button>
  ),
  Column: ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>,
  Row: ({ children }) => <div style={{ display: 'flex', gap: 8 }}>{children}</div>,
  Card: ({ children }) => <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>{children}</div>,
};
```

**2. Stream Hook** (`src/a2ui/useA2UI.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';

interface Component { id: string; type: string; children?: string[]; data?: Record<string, unknown>; action?: any; }

export function useA2UI(url: string) {
  const [components, setComponents] = useState<Map<string, Component>>(new Map());
  const [dataModel, setDataModel] = useState<Record<string, unknown>>({});
  const [rootId, setRootId] = useState<string | null>(null);

  useEffect(() => {
    const source = new EventSource(url);
    source.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'surfaceUpdate') {
        setComponents(prev => {
          const next = new Map(prev);
          for (const comp of msg.components) next.set(comp.id, comp);
          return next;
        });
      } else if (msg.type === 'dataModelUpdate') {
        setDataModel(prev => ({ ...prev, ...msg.data }));
      } else if (msg.type === 'beginRendering') {
        setRootId(msg.rootComponentId);
      }
    };
    return () => source.close();
  }, [url]);

  return { components, dataModel, rootId };
}
```

**3. Renderer** (`src/a2ui/A2UIRenderer.tsx`)

```typescript
import { registry, A2UIProps } from './registry';

function resolveDataBindings(data: Record<string, unknown>, model: Record<string, unknown>): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'string' && val.startsWith('$.')) {
      const path = val.slice(2).split('.');
      let current: any = model;
      for (const seg of path) current = current?.[seg];
      resolved[key] = current;
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

export function A2UIRenderer({ componentId, components, dataModel, onAction }: {
  componentId: string;
  components: Map<string, any>;
  dataModel: Record<string, unknown>;
  onAction: (action: any) => void;
}) {
  const comp = components.get(componentId);
  if (!comp) return null;

  const Widget = registry[comp.type];
  if (!Widget) return <span>[Unsupported: {comp.type}]</span>;

  const resolvedData = comp.data ? resolveDataBindings(comp.data, dataModel) : {};
  const children = comp.children?.map((childId: string) => (
    <A2UIRenderer key={childId} componentId={childId} components={components} dataModel={dataModel} onAction={onAction} />
  ));

  return <Widget id={comp.id} data={resolvedData} onAction={onAction}>{children}</Widget>;
}
```

### Minimal Flutter Setup

**1. Widget Registry** (`lib/a2ui/registry.dart`)

```dart
import 'package:flutter/material.dart';

typedef A2UIBuilder = Widget Function(
  Map<String, dynamic> data,
  List<Widget> children,
  void Function(String action, Map<String, dynamic> context)? onAction,
);

final Map<String, A2UIBuilder> a2uiRegistry = {
  'Text': (data, _, __) => Text(data['text']?.toString() ?? ''),
  'Button': (data, _, onAction) => ElevatedButton(
    onPressed: () => onAction?.call(data['actionName'] ?? '', {}),
    child: Text(data['label']?.toString() ?? ''),
  ),
  'Column': (_, children, __) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: children,
  ),
  'Row': (_, children, __) => Row(children: children),
  'Card': (_, children, __) => Card(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
    ),
  ),
};
```

**2. Stream Service** (`lib/a2ui/a2ui_service.dart`)

```dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

class A2UIService {
  final Map<String, Map<String, dynamic>> components = {};
  final Map<String, dynamic> dataModel = {};
  String? rootId;

  final _updateController = StreamController<void>.broadcast();
  Stream<void> get onUpdate => _updateController.stream;

  Future<void> connect(String url) async {
    final client = http.Client();
    final request = http.Request('GET', Uri.parse(url));
    final response = await client.send(request);

    response.stream.transform(utf8.decoder).transform(const LineSplitter()).listen((line) {
      if (line.startsWith('data: ')) {
        final msg = jsonDecode(line.substring(6)) as Map<String, dynamic>;
        _handleMessage(msg);
      }
    });
  }

  void _handleMessage(Map<String, dynamic> msg) {
    switch (msg['type']) {
      case 'surfaceUpdate':
        for (final comp in msg['components'] as List) {
          components[comp['id']] = comp as Map<String, dynamic>;
        }
        break;
      case 'dataModelUpdate':
        dataModel.addAll(msg['data'] as Map<String, dynamic>);
        break;
      case 'beginRendering':
        rootId = msg['rootComponentId'] as String;
        break;
    }
    _updateController.add(null);
  }
}
```

**3. Renderer** (`lib/a2ui/a2ui_renderer.dart`)

```dart
import 'package:flutter/material.dart';
import 'registry.dart';

class A2UIRenderer extends StatelessWidget {
  final String componentId;
  final Map<String, Map<String, dynamic>> components;
  final Map<String, dynamic> dataModel;
  final void Function(String action, Map<String, dynamic> context)? onAction;

  const A2UIRenderer({
    super.key,
    required this.componentId,
    required this.components,
    required this.dataModel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    final comp = components[componentId];
    if (comp == null) return const SizedBox.shrink();

    final type = comp['type'] as String;
    final builder = a2uiRegistry[type];
    if (builder == null) return Text('[Unsupported: $type]');

    final data = _resolveBindings(comp['data'] as Map<String, dynamic>? ?? {});
    final childIds = (comp['children'] as List?)?.cast<String>() ?? [];
    final children = childIds.map((id) => A2UIRenderer(
      componentId: id,
      components: components,
      dataModel: dataModel,
      onAction: onAction,
    )).toList();

    return builder(data, children, onAction);
  }

  Map<String, dynamic> _resolveBindings(Map<String, dynamic> data) {
    return data.map((key, value) {
      if (value is String && value.startsWith(r'$.')) {
        final path = value.substring(2).split('.');
        dynamic current = dataModel;
        for (final seg in path) {
          if (current is Map) current = current[seg];
          else return MapEntry(key, null);
        }
        return MapEntry(key, current);
      }
      return MapEntry(key, value);
    });
  }
}
```

---

## Integration Patterns

### Pattern 1: Local Agent (Simplest)

```
Your Backend (LLM)  ──SSE──>  Your Client (React/Flutter)
```

The LLM running in your backend generates A2UI JSONL directly, streamed to your client via SSE. Single connection, no intermediaries.

**Use when**: Your agent is part of your own backend.

### Pattern 2: Remote Agent via A2A

```
Remote Agent  ──A2A──>  Your Orchestrator  ──SSE──>  Your Client
```

A remote agent service returns A2UI payloads as artifacts in A2A task responses. Your orchestrator extracts the A2UI artifact and forwards it to the client's SSE stream.

**Use when**: You consume third-party agents that produce UI.

### Pattern 3: Orchestrator Rewrite

```
Agent A  ──A2A──>  ┐
Agent B  ──A2A──>  ├──> Orchestrator ──SSE──> Client
Agent C  ──A2A──>  ┘    (combine/transform)
```

Multiple specialist agents produce A2UI fragments. Your orchestrator combines them into a unified multi-surface layout before streaming to the client.

**Use when**: Multi-agent dashboards, composite views from multiple sources.

---

## Common Component Reference

| Component | Purpose | Key Properties |
|-----------|---------|----------------|
| Text | Display text | text, style, align |
| Button | Clickable action | label, action, variant (primary/secondary/text) |
| Card | Content container | elevation, padding |
| Row | Horizontal layout | alignment, spacing, wrap |
| Column | Vertical layout | alignment, spacing |
| Image | Display image | src, alt, fit (cover/contain) |
| Input | Text input | placeholder, value, onSubmit action |
| Select | Dropdown | options (label/value pairs), selected |
| List | Scrollable list | children (component IDs) |
| Divider | Visual separator | thickness, color |
| Chip | Tag/label | text, onTap action, selected (boolean) |
| Badge | Status indicator | text, color |
| Progress | Loading indicator | value (0-1), type (linear/circular) |
| Alert | Notification | message, severity (info/warning/error/success) |
| Tabs | Tab navigation | tabs (label/surfaceId pairs), activeIndex |
| Table | Tabular data | headers, rows (arrays of component IDs) |

---

## Custom Components

### When to Create Custom

- The common library doesn't cover your use case
- You need project-specific interactive widgets (e.g., map, chart, calendar)
- You want to wrap an existing design system component

### Registration Pattern

1. Add the builder to your Widget Registry
2. Define the component schema (required/optional properties)
3. Advertise via `clientCapabilities` so the server knows it's available
4. Provide text-only fallback for clients that don't support it

---

## A2A Transport

### Agent Card Declaration

Advertise A2UI support in your A2A Agent Card:

```json
{
  "name": "my-agent",
  "capabilities": {
    "a2ui": {
      "supported": true,
      "catalogUri": "https://example.com/catalog.json"
    }
  }
}
```

### Task Response with A2UI Artifact

```json
{
  "id": "task-123",
  "status": { "state": "completed" },
  "artifacts": [{
    "type": "a2ui",
    "mimeType": "application/jsonl",
    "parts": [
      { "type": "surfaceUpdate", "surfaceId": "main", "components": [...] },
      { "type": "dataModelUpdate", "surfaceId": "main", "data": {...} },
      { "type": "beginRendering", "surfaceId": "main", "rootComponentId": "root" }
    ]
  }]
}
```

---

## Security Checklist

- [ ] Widget Registry is a closed catalog (deny unknown types by default)
- [ ] All text content sanitized (DOMPurify for React, framework escaping for Flutter)
- [ ] No raw PII in component trees (use data model path references)
- [ ] userAction payloads validated against schemas on server
- [ ] Rate limiting on surface updates (prevent UI thrashing)
- [ ] CSP headers configured (web only)
- [ ] Security events logged (registry misses, sanitization triggers, validation failures)
- [ ] Client capability negotiation implemented (don't send unsupported components)

---

## Testing Strategies

### Widget Registry Tests
- Verify all registered component types render without errors
- Verify unknown types trigger fallback rendering
- Verify registry resolution performance

### Component Tree Rendering Tests
- Render component trees of various depths and verify output
- Test data model binding resolution (valid paths, missing paths, nested paths)
- Test incremental updates (add components, update data, delete surfaces)

### Security Tests
- Inject unknown component types and verify rejection
- Send XSS payloads in text content and verify sanitization
- Send malformed userAction payloads and verify server validation

### Integration Tests
- Full SSE stream -> parse -> render cycle
- Multi-surface coordination (update one surface, verify others unchanged)
- Graceful degradation when A2UI is unavailable

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Blank surface | `beginRendering` not sent or rootComponentId missing | Check server sends `beginRendering` after components |
| Unknown component fallback | Component type not in Widget Registry | Add to registry or check for typos |
| Stale data | Data model not updating | Verify `dataModelUpdate` messages are being received and merged |
| PII in logs | PII embedded in component tree | Move to data model, reference via `$.` path |
| Slow rendering | Deep component trees or too-frequent updates | Flatten tree, batch surface updates |
| SSE disconnection | Server timeout or network issue | Implement auto-reconnect with exponential backoff |

---

## Further Reading

- `@a2ui-specialist` — Invoke for implementation guidance
- `@agent-ui` — Domain agent for architectural decisions
- A2UI specification (Apache 2.0 licensed, contributed to Linux Foundation)
- A2A Protocol specification for remote agent UI transport
