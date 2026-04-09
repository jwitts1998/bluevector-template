'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Cloud,
  Shield,
  Key,
  Database,
  Server,
  Lock,
  Mail,
  CheckCircle2,
  Circle,
  AlertCircle,
  ExternalLink,
  Settings,
  ArrowRight,
  Zap,
  Terminal,
} from 'lucide-react';

interface SetupItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: 'not_started' | 'in_progress' | 'complete';
  category: string;
  command?: string;
  envVar?: string;
}

const SETUP_ITEMS: SetupItem[] = [
  {
    id: 'gcp_project',
    label: 'GCP Project',
    description: 'Create or select a Google Cloud project for this engagement',
    icon: Cloud,
    status: 'not_started',
    category: 'core',
    command: 'gcloud projects create PROJECT_ID --name="Project Name"',
    envVar: 'GCP_PROJECT_ID',
  },
  {
    id: 'gcloud_auth',
    label: 'gcloud Authentication',
    description: 'Authenticate with Google Cloud SDK',
    icon: Shield,
    status: 'not_started',
    category: 'core',
    command: 'gcloud auth login && gcloud auth application-default login',
  },
  {
    id: 'firebase',
    label: 'Firebase Project',
    description: 'Initialize Firebase for Auth, Hosting, and Cloud Functions',
    icon: Zap,
    status: 'not_started',
    category: 'core',
    command: 'firebase init',
    envVar: 'FIREBASE_PROJECT_ID',
  },
  {
    id: 'ai_studio',
    label: 'Google AI Studio',
    description: 'Configure Gemini API key from Google AI Studio',
    icon: Key,
    status: 'not_started',
    category: 'ai',
    envVar: 'GOOGLE_AI_STUDIO_KEY',
  },
  {
    id: 'anthropic',
    label: 'Anthropic API Key',
    description: 'Claude API key for AI-powered agent system',
    icon: Key,
    status: 'not_started',
    category: 'ai',
    envVar: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'cloud_sql',
    label: 'Cloud SQL',
    description: 'Provision managed PostgreSQL instance',
    icon: Database,
    status: 'not_started',
    category: 'infrastructure',
    command: 'gcloud sql instances create INSTANCE --database-version=POSTGRES_15 --region=us-central1 --tier=db-f1-micro',
  },
  {
    id: 'cloud_run',
    label: 'Cloud Run',
    description: 'Enable Cloud Run API for serverless container deployment',
    icon: Server,
    status: 'not_started',
    category: 'infrastructure',
    command: 'gcloud services enable run.googleapis.com',
  },
  {
    id: 'secret_manager',
    label: 'Secret Manager',
    description: 'Enable Secret Manager for production secrets (replaces .env)',
    icon: Lock,
    status: 'not_started',
    category: 'infrastructure',
    command: 'gcloud services enable secretmanager.googleapis.com',
  },
  {
    id: 'gws',
    label: 'Google Workspace CLI',
    description: 'Install gws CLI for Drive, Sheets, Gmail, Calendar automation',
    icon: Mail,
    status: 'not_started',
    category: 'workspace',
    command: 'npm install -g @anthropic/gws-cli',
  },
  {
    id: 'mcp_servers',
    label: 'MCP Servers',
    description: 'Activate 28 MCP servers across 10 capability tiers',
    icon: Settings,
    status: 'not_started',
    category: 'tooling',
  },
];

const CATEGORIES: Record<string, { label: string; description: string }> = {
  core: { label: 'Core GCP', description: 'Google Cloud project foundation' },
  ai: { label: 'AI & LLM Keys', description: 'API keys for AI capabilities' },
  infrastructure: { label: 'Infrastructure', description: 'Database, compute, secrets' },
  workspace: { label: 'Google Workspace', description: 'Productivity automation' },
  tooling: { label: 'Development Tooling', description: 'MCP servers and IDE setup' },
};

export default function SetupPage() {
  const [items, setItems] = useState(SETUP_ITEMS);
  const [envValues, setEnvValues] = useState<Record<string, string>>({});

  const toggleStatus = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'not_started'
                  ? 'in_progress'
                  : item.status === 'in_progress'
                  ? 'complete'
                  : 'not_started',
            }
          : item
      )
    );
  };

  const completedCount = items.filter(i => i.status === 'complete').length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCP Project Setup</h1>
          <p className="text-muted-foreground mt-1">
            Configure your Google Cloud infrastructure for this engagement
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{progressPct}%</p>
          <p className="text-xs text-muted-foreground">{completedCount}/{totalCount} configured</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Environment Variables Card */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-600" />
            Environment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GCP_PROJECT_ID</Label>
              <Input
                placeholder="my-gcp-project"
                value={envValues['GCP_PROJECT_ID'] || ''}
                onChange={e => setEnvValues(prev => ({ ...prev, GCP_PROJECT_ID: e.target.value }))}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">FIREBASE_PROJECT_ID</Label>
              <Input
                placeholder="my-firebase-project"
                value={envValues['FIREBASE_PROJECT_ID'] || ''}
                onChange={e => setEnvValues(prev => ({ ...prev, FIREBASE_PROJECT_ID: e.target.value }))}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GCP_REGION</Label>
              <Input
                placeholder="us-central1"
                value={envValues['GCP_REGION'] || 'us-central1'}
                onChange={e => setEnvValues(prev => ({ ...prev, GCP_REGION: e.target.value }))}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GOOGLE_AI_STUDIO_KEY</Label>
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={envValues['GOOGLE_AI_STUDIO_KEY'] || ''}
                onChange={e => setEnvValues(prev => ({ ...prev, GOOGLE_AI_STUDIO_KEY: e.target.value }))}
                className="mt-1 bg-white"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700">
              Save to .env.local
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Push to Secret Manager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Categories */}
      {Object.entries(CATEGORIES).map(([catKey, cat]) => {
        const catItems = items.filter(i => i.category === catKey);
        const catComplete = catItems.filter(i => i.status === 'complete').length;

        return (
          <div key={catKey}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold">{cat.label}</h2>
              <Badge variant="secondary" className="text-xs">
                {catComplete}/{catItems.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {catItems.map(item => {
                const Icon = item.icon;
                const statusIcon =
                  item.status === 'complete' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : item.status === 'in_progress' ? (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/30" />
                  );

                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleStatus(item.id)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{statusIcon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-purple-600 shrink-0" />
                            <p className="font-medium text-sm">{item.label}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          {item.command && (
                            <code className="block mt-2 text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground truncate">
                              $ {item.command}
                            </code>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Next Step */}
      <Card className="border-sky-200 bg-sky-50/30">
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Ready for Design?</p>
            <p className="text-xs text-muted-foreground">
              Once GCP is configured, move to Phase 2 to create Product Design Blueprints
            </p>
          </div>
          <Link href="/design">
            <Button size="sm" className="gap-1 bg-sky-600 hover:bg-sky-700">
              Phase 2: Design <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
