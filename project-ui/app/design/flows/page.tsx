'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workflow, Bot, Plus, FileText, GitBranch, Repeat, Users, Zap } from 'lucide-react';

interface FlowDoc {
  id: string;
  title: string;
  type: string;
  updatedAt?: string;
}

const FLOW_TYPES = [
  {
    title: 'User Flow Diagrams',
    description: 'Map end-to-end user journeys through the application, from entry to goal completion',
    icon: Users,
    agent: '@designer',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    template: 'user-flow',
  },
  {
    title: 'System Sequence Diagrams',
    description: 'Document API call sequences between frontend, backend, GCP services, and third-party integrations',
    icon: GitBranch,
    agent: '@gcp-specialist',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    template: 'system-sequence',
  },
  {
    title: 'State Machines',
    description: 'Define state transitions for complex workflows like auth, payments, onboarding, and order processing',
    icon: Repeat,
    agent: '@orchestration-specialist',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    template: 'state-machine',
  },
  {
    title: 'Event-Driven Architecture',
    description: 'Map Cloud Functions triggers, Pub/Sub topics, Firestore listeners, and async processing pipelines',
    icon: Zap,
    agent: '@firebase-specialist',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    template: 'event-driven',
  },
];

export default function FlowsPage() {
  const router = useRouter();
  const [flows, setFlows] = useState<FlowDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(data => {
        const docs: FlowDoc[] = (data.documents || []).filter(
          (d: FlowDoc) => d.type === 'flows' || d.title?.toLowerCase().includes('flow')
        );
        setFlows(docs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Process Flows</h1>
          <p className="text-muted-foreground mt-1">
            User flows, sequence diagrams, state machines, and architecture diagrams
          </p>
        </div>
        <Button
          className="gap-1 bg-violet-600 hover:bg-violet-700"
          onClick={() => router.push('/design/create?type=flows')}
        >
          <Plus className="h-4 w-4" /> New Flow
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {FLOW_TYPES.map(flow => {
          const Icon = flow.icon;
          return (
            <Card
              key={flow.title}
              className="hover:shadow-sm transition-all cursor-pointer"
              onClick={() => router.push(`/design/create?type=flows&template=${flow.template}`)}
            >
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg ${flow.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${flow.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{flow.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{flow.description}</p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs font-mono">
                        <Bot className="h-3 w-3 mr-1" />{flow.agent}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Existing flow documents */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p className="text-sm">Loading flow documents...</p>
          </CardContent>
        </Card>
      ) : flows.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-3">Existing Flows</h2>
          <div className="space-y-2">
            {flows.map(flow => (
              <Card key={flow.id} className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push(`/design/create?type=flows&doc=${flow.id}`)}>
                <CardContent className="py-3 flex items-center gap-3">
                  <FileText className="h-4 w-4 text-violet-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{flow.title}</p>
                    {flow.updatedAt && (
                      <p className="text-xs text-muted-foreground">Updated {new Date(flow.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{flow.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Workflow className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No process flows yet</p>
            <p className="text-sm mt-1">
              Click a flow type above or use the New Flow button to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
