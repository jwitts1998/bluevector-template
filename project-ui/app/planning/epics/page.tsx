'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderKanban, Bot, Plus, Users, Target, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  agent_roles: string[];
  acceptance_criteria: string[];
}

export default function EpicsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => setTasks(d.tasks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Epics & User Stories</h1>
          <p className="text-muted-foreground mt-1">
            Organize work into epics with user stories, acceptance criteria, and functional requirements
          </p>
        </div>
        <Button className="gap-1 bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4" /> Generate from PDB
        </Button>
      </div>

      {/* How it works */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="py-4">
          <p className="font-semibold text-sm mb-2">Epic Generation Workflow</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded font-medium">PDB</span>
            <span>&rarr;</span>
            <Badge variant="outline" className="text-xs font-mono">
              <Bot className="h-3 w-3 mr-1" />@pdb-to-tasks
            </Badge>
            <span>&rarr;</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">Epics</span>
            <span>&rarr;</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">User Stories</span>
            <span>&rarr;</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Tasks</span>
          </div>
        </CardContent>
      </Card>

      {/* User Story Template */}
      <Card>
        <CardContent className="py-4">
          <p className="font-semibold text-sm mb-3">User Story Format</p>
          <div className="bg-muted rounded-lg p-4 text-sm font-mono">
            <p className="text-muted-foreground">As a <span className="text-primary font-semibold">[role]</span>,</p>
            <p className="text-muted-foreground">I want <span className="text-primary font-semibold">[feature/capability]</span>,</p>
            <p className="text-muted-foreground">So that <span className="text-primary font-semibold">[business value/benefit]</span>.</p>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Acceptance Criteria:</p>
              <p className="text-xs text-muted-foreground">- Given [context], when [action], then [expected result]</p>
              <p className="text-xs text-muted-foreground">- Given [context], when [action], then [expected result]</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks as stories */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading...</div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No epics or user stories yet</p>
            <p className="text-sm mt-1">
              Create a Product Design Blueprint first, then use <code className="bg-muted px-1 py-0.5 rounded text-xs">@pdb-to-tasks</code> to generate epics
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card key={task.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  {task.status === 'done' || task.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/30 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                      <Badge variant="secondary" className="text-xs">{task.status}</Badge>
                      {task.agent_roles?.map(role => (
                        <Badge key={role} variant="outline" className="text-[10px] font-mono">{role}</Badge>
                      ))}
                    </div>
                    {task.acceptance_criteria?.length > 0 && (
                      <div className="mt-2">
                        {task.acceptance_criteria.map((ac, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex gap-1">
                            <span className="text-muted-foreground/40">-</span> {ac}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
