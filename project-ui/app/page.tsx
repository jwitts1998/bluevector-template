'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cloud,
  Palette,
  Map,
  Hammer,
  ArrowRight,
  CheckCircle2,
  Circle,
  Bot,
  ListChecks,
  FileText,
  Settings,
  Workflow,
  PenTool,
  FolderKanban,
  MessageSquare,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface ProjectInfo {
  name: string;
  stack: string;
  description: string;
  agentCount: number;
  taskCount: number;
  docsCount: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

const PHASES = [
  {
    id: 'setup',
    number: 1,
    title: 'Setup',
    subtitle: 'GCP Project & Infrastructure',
    description: 'Configure GCP project, credentials, Google AI Studio key, Workspace integration, and MCP servers.',
    icon: Cloud,
    href: '/setup',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badgeClass: 'phase-badge-setup',
    checklist: [
      { label: 'GCP Project ID configured', key: 'gcp_project' },
      { label: 'Firebase Auth setup', key: 'firebase' },
      { label: 'Google AI Studio key', key: 'ai_studio' },
      { label: 'MCP servers activated', key: 'mcp' },
      { label: 'Google Workspace CLI', key: 'gws' },
      { label: 'Secret Manager configured', key: 'secrets' },
    ],
  },
  {
    id: 'design',
    number: 2,
    title: 'Design & Ideation',
    subtitle: 'Product Design Blueprints',
    description: 'Create Product Design Blueprints, technical solution designs, process flow diagrams, and wireframes.',
    icon: Palette,
    href: '/design',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    badgeClass: 'phase-badge-design',
    checklist: [
      { label: 'Product Design Blueprint (PDB)', key: 'pdb' },
      { label: 'Technical Architecture Design', key: 'tad' },
      { label: 'Process flow diagrams', key: 'flows' },
      { label: 'Wireframes & UI concepts', key: 'wireframes' },
      { label: 'Data model design', key: 'data_model' },
    ],
  },
  {
    id: 'planning',
    number: 3,
    title: 'Planning',
    subtitle: 'Epics, Stories & Tasks',
    description: 'Break down designs into epics, features, user stories, and tasks with acceptance criteria and functional requirements.',
    icon: Map,
    href: '/planning',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeClass: 'phase-badge-planning',
    checklist: [
      { label: 'Epics defined', key: 'epics' },
      { label: 'User stories with acceptance criteria', key: 'stories' },
      { label: 'Technical requirements documented', key: 'tech_reqs' },
      { label: 'Task breakdown complete', key: 'tasks' },
      { label: 'Sprint/iteration plan', key: 'sprint' },
    ],
  },
  {
    id: 'build',
    number: 4,
    title: 'Build',
    subtitle: 'Development & Deployment',
    description: 'Execute development with 52 specialist agents, AI chat, CI/CD pipelines, and GCP deployment.',
    icon: Hammer,
    href: '/build',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badgeClass: 'phase-badge-build',
    checklist: [
      { label: 'Development environment ready', key: 'dev_env' },
      { label: 'Agent execution started', key: 'agents_active' },
      { label: 'CI/CD pipeline configured', key: 'cicd' },
      { label: 'Deployed to Cloud Run', key: 'deployed' },
      { label: 'Monitoring & observability', key: 'monitoring' },
    ],
  },
];

const GCP_SERVICES = [
  { name: 'Cloud Run', status: 'ready', desc: 'Serverless containers' },
  { name: 'Cloud SQL', status: 'ready', desc: 'Managed PostgreSQL' },
  { name: 'Firebase Auth', status: 'ready', desc: 'Authentication' },
  { name: 'Firebase Hosting', status: 'ready', desc: 'CDN-backed hosting' },
  { name: 'Secret Manager', status: 'ready', desc: 'Secrets vault' },
  { name: 'Cloud Build', status: 'ready', desc: 'CI/CD pipelines' },
  { name: 'Cloud Functions', status: 'ready', desc: 'Event-driven compute' },
  { name: 'Artifact Registry', status: 'ready', desc: 'Container images' },
];

export default function DashboardPage() {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('/api/project').then(r => r.json()).then(setProject).catch(() => {});
    fetch('/api/tasks').then(r => r.json()).then(d => setTasks(d.tasks || [])).catch(() => {});
  }, []);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => ['done', 'completed'].includes(t.status)).length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl p-6 bv-gradient-bg border border-[rgba(30,82,241,0.1)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/bv-presto-prod-website-public/00000000-0000-0000-0000-000000000000-logo.png"
              alt="BlueVector AI"
              className="h-12 w-12 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1e52f1' }}>
                {project?.name || 'BlueVector.AI'}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Google Cloud-Focused Consultancy — Empowering Innovation
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Cloud className="h-3 w-3" />
              Google Cloud Partner
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Bot className="h-3 w-3" />
              {project?.agentCount || 52} Agents
            </Badge>
          </div>
        </div>
      </div>

      {/* Engagement Lifecycle — 4 Phases */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Engagement Lifecycle</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            return (
              <Link key={phase.id} href={phase.href}>
                <Card className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${phase.borderColor} h-full`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`h-8 w-8 rounded-lg ${phase.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${phase.color}`} />
                      </div>
                      <span className={`text-xs font-bold ${phase.color}`}>Phase {phase.number}</span>
                    </div>
                    <CardTitle className="text-base mt-2">{phase.title}</CardTitle>
                    <p className="text-xs text-muted-foreground font-medium">{phase.subtitle}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {phase.description}
                    </p>
                    <div className="space-y-1.5">
                      {phase.checklist.slice(0, 3).map((item) => (
                        <div key={item.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Circle className="h-3 w-3 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                      {phase.checklist.length > 3 && (
                        <p className="text-xs text-muted-foreground/60 pl-5">
                          +{phase.checklist.length - 3} more items
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* GCP Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">GCP Service Stack</h2>
          <Link href="/setup">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Configure <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GCP_SERVICES.map((service) => (
            <Card key={service.name} className="hover:bg-accent/30 transition-colors">
              <CardContent className="py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Cloud className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions + Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/setup">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 py-4">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Configure GCP Project</p>
                    <p className="text-xs text-muted-foreground">Set up credentials & services</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/design/blueprints">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 py-4">
                  <PenTool className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-medium text-sm">Create Product Blueprint</p>
                    <p className="text-xs text-muted-foreground">Start with @idea-to-pdb</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/planning">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 py-4">
                  <FolderKanban className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">Plan Epics & Stories</p>
                    <p className="text-xs text-muted-foreground">Break down into tasks</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/chat">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 py-4">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Open AI Chat</p>
                    <p className="text-xs text-muted-foreground">Project-scoped assistant</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Project Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Project Stats</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Agents</span>
                </div>
                <span className="text-2xl font-bold">{project?.agentCount || 52}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{tasks.length}</span>
                  {tasks.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {todoCount} todo / {inProgressCount} active / {doneCount} done
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-600" />
                  <span className="text-sm font-medium">Docs</span>
                </div>
                <span className="text-2xl font-bold">{project?.docsCount || 0}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">GCP Services</span>
                </div>
                <span className="text-2xl font-bold">{GCP_SERVICES.length}</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* MCP Ecosystem Summary */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">MCP Ecosystem</p>
              <p className="text-xs text-muted-foreground">
                28 MCP servers across 10 tiers — Context7, Stitch, GitHub, Firebase, Sentry, E2B, and more
              </p>
            </div>
            <Link href="/setup/config">
              <Button variant="outline" size="sm" className="text-xs">
                View Configuration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
