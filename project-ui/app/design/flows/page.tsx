'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workflow, Bot, Plus, ArrowRight, GitBranch, Repeat, Users, Zap } from 'lucide-react';

const FLOW_TYPES = [
  {
    title: 'User Flow Diagrams',
    description: 'Map end-to-end user journeys through the application, from entry to goal completion',
    icon: Users,
    agent: '@designer',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    title: 'System Sequence Diagrams',
    description: 'Document API call sequences between frontend, backend, GCP services, and third-party integrations',
    icon: GitBranch,
    agent: '@gcp-specialist',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'State Machines',
    description: 'Define state transitions for complex workflows like auth, payments, onboarding, and order processing',
    icon: Repeat,
    agent: '@orchestration-specialist',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Event-Driven Architecture',
    description: 'Map Cloud Functions triggers, Pub/Sub topics, Firestore listeners, and async processing pipelines',
    icon: Zap,
    agent: '@firebase-specialist',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

export default function FlowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Process Flows</h1>
          <p className="text-muted-foreground mt-1">
            User flows, sequence diagrams, state machines, and architecture diagrams
          </p>
        </div>
        <Button className="gap-1 bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4" /> New Flow
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {FLOW_TYPES.map(flow => {
          const Icon = flow.icon;
          return (
            <Card key={flow.title} className="hover:shadow-sm transition-all">
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

      {/* Empty state */}
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Workflow className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No process flows yet</p>
          <p className="text-sm mt-1">
            Flows will be generated as part of the Product Design Blueprint process
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
