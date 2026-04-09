'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  agent_roles: string[];
  acceptance_criteria: string[];
  file: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const STATUS_GROUPS: Record<string, string[]> = {
  'To Do': ['todo', 'pending', 'ready'],
  'In Progress': ['in_progress', 'active'],
  'Done': ['done', 'completed'],
  'Blocked': ['blocked', 'failed', 'cancelled'],
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => setTasks(d.tasks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getTasksForGroup = (statuses: string[]) =>
    tasks.filter(t => statuses.includes(t.status));

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">{tasks.length} tasks from tasks/*.yml</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(STATUS_GROUPS).map(([label, statuses]) => {
          const count = getTasksForGroup(statuses).length;
          return (
            <Card key={label}>
              <CardContent className="py-3 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No tasks found in tasks/*.yml</p>
            <p className="text-sm mt-2">Use @pdb-to-tasks to generate tasks from a Product Design Blueprint</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          {/* Board View */}
          <TabsContent value="board">
            <div className="grid gap-4 md:grid-cols-4">
              {Object.entries(STATUS_GROUPS).map(([label, statuses]) => (
                <div key={label}>
                  <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                    {label}
                    <Badge variant="secondary">{getTasksForGroup(statuses).length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {getTasksForGroup(statuses).map(task => (
                      <Card
                        key={task.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setSelectedTask(task)}
                      >
                        <CardContent className="py-3">
                          <p className="font-medium text-sm">{task.title}</p>
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority] || ''}`}>
                              {task.priority}
                            </span>
                            {task.agent_roles.slice(0, 2).map(role => (
                              <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <div className="space-y-2">
              {tasks.map(task => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.id} — {task.file}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.priority}</Badge>
                      <Badge variant="secondary">{task.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div className="flex gap-2">
                  <Badge>{selectedTask.status}</Badge>
                  <Badge variant="outline">{selectedTask.priority}</Badge>
                </div>

                {selectedTask.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>
                )}

                {selectedTask.agent_roles.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Agent Roles</p>
                    <div className="flex gap-1 flex-wrap">
                      {selectedTask.agent_roles.map(role => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.acceptance_criteria.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Acceptance Criteria</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedTask.acceptance_criteria.map((ac, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-muted-foreground/50">-</span>
                          {ac}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-1">Source</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedTask.file} — {selectedTask.id}</p>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
