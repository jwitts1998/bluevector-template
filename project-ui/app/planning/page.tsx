'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  ListChecks,
  ArrowRight,
  Bot,
  Users,
  ClipboardCheck,
  Plus,
  CheckCircle2,
  Circle,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  agent_roles: string[];
}

const PLANNING_WORKFLOW = [
  {
    step: 1,
    title: 'Generate Epics from PDB',
    description: 'Use @pdb-to-tasks to automatically decompose your Product Design Blueprint into epics and feature groups',
    agent: '@pdb-to-tasks',
    icon: FolderKanban,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    prompt: 'Generate epics from the Product Design Blueprint',
  },
  {
    step: 2,
    title: 'Define User Stories',
    description: 'Break epics into user stories with clear acceptance criteria: "As a [role], I want [feature], so that [benefit]"',
    agent: '@task-orchestrator',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    prompt: 'Break the epics into user stories with acceptance criteria',
  },
  {
    step: 3,
    title: 'Technical Requirements',
    description: 'Map functional requirements, GCP service dependencies, API contracts, and data model changes per story',
    agent: '@gcp-specialist',
    icon: ClipboardCheck,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    prompt: 'Map technical requirements, GCP dependencies, and API contracts for each user story',
  },
  {
    step: 4,
    title: 'Task Breakdown',
    description: 'Create granular development tasks with agent role assignments, acceptance criteria, and priority levels',
    agent: '@task-orchestrator',
    icon: ListChecks,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    prompt: 'Create granular development tasks with agent role assignments and priority levels',
  },
];

export default function PlanningPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => setTasks(d.tasks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => ['done', 'completed'].includes(t.status)).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning</h1>
          <p className="text-muted-foreground mt-1">
            Break designs into epics, features, user stories, and executable tasks
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{totalTasks}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{todoCount}</p>
            <p className="text-xs text-muted-foreground">To Do</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-green-600">{doneCount}</p>
            <p className="text-xs text-muted-foreground">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Planning Workflow */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Planning Workflow</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {PLANNING_WORKFLOW.map(step => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="hover:shadow-sm transition-all">
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg ${step.bgColor} flex items-center justify-center shrink-0`}>
                      <span className={`font-bold text-sm ${step.color}`}>{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          <Bot className="h-3 w-3 mr-1" />
                          {step.agent}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 gap-1"
                          onClick={() => router.push('/chat?prompt=' + encodeURIComponent(step.prompt))}
                        >
                          <Plus className="h-3 w-3" /> Run
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/tasks">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-3 py-5">
              <ListChecks className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-semibold text-sm">Task Board</p>
                <p className="text-xs text-muted-foreground">
                  View and manage all tasks in board or list view
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/planning/epics">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-3 py-5">
              <FolderKanban className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-semibold text-sm">Epics & Stories</p>
                <p className="text-xs text-muted-foreground">
                  Organize work into epics with user stories and acceptance criteria
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Tasks Preview */}
      {tasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <Card key={task.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {task.status === 'done' || task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                    <Badge variant="secondary" className="text-xs">{task.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
