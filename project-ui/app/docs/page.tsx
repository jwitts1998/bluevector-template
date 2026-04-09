'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface DocNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: DocNode[];
}

export default function DocsPage() {
  const [tree, setTree] = useState<DocNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(d => setTree(d.tree || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDocClick = async (path: string) => {
    setSelectedPath(path);
    try {
      const res = await fetch(`/api/docs?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setContent(data.content || 'No content');
    } catch {
      setContent('Failed to load document');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading docs...</div>;
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* File Tree Sidebar */}
      <div className="w-64 shrink-0">
        <h2 className="text-lg font-semibold mb-3">Documents</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-1 pr-4">
            {tree.map(node => (
              <TreeNode key={node.path} node={node} selectedPath={selectedPath} onSelect={handleDocClick} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {selectedPath ? (
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-xs text-muted-foreground font-mono">{selectedPath}</p>
              </div>
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{content}</pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Select a document to view</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedPath,
  onSelect,
  depth = 0,
}: {
  node: DocNode;
  selectedPath: string | null;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  if (node.type === 'directory') {
    return (
      <div>
        <button
          className="flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-sm hover:bg-accent transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0" />
          )}
          <Folder className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && node.children?.map(child => (
          <TreeNode key={child.path} node={child} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <button
      className={cn(
        'flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-sm transition-colors',
        selectedPath === node.path ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent text-muted-foreground'
      )}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => onSelect(node.path)}
    >
      <FileText className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{node.name.replace('.md', '')}</span>
    </button>
  );
}
