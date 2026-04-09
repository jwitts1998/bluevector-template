'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cloud, Key, ExternalLink, ChevronRight, Sparkles, Bot } from 'lucide-react';

interface MCPServer {
  name: string;
  description: string;
  docs: string;
  npm?: string;
  envVars?: string[];
}

interface MCPTier {
  tier: number;
  name: string;
  color: string;
  servers: MCPServer[];
}

const MCP_TIERS: MCPTier[] = [
  {
    tier: 1, name: 'Essential', color: 'bg-blue-100 text-blue-700',
    servers: [
      { name: 'Context7', description: 'Real-time library documentation lookup. Provides up-to-date API references and usage examples for any npm/pip package directly in context.', docs: 'https://github.com/context7/context7-mcp', npm: '@context7/mcp' },
      { name: 'Sequential Thinking', description: 'Multi-step reasoning engine. Breaks complex problems into sequential steps for more reliable analysis and decision-making.', docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking', npm: '@modelcontextprotocol/server-sequential-thinking' },
      { name: 'Idea-Reality', description: 'Idea validation and planning. Evaluates feasibility, generates implementation plans, and identifies risks for new project ideas.', docs: 'https://github.com/cyanheads/idea-reality-mcp', npm: 'idea-reality-mcp' },
      { name: 'GitHub', description: 'Full GitHub integration. Repository management, PR reviews, issue tracking, code search, and commit history via GitHub API.', docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github', npm: '@modelcontextprotocol/server-github', envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN'] },
      { name: 'Filesystem', description: 'Local file operations. Read, write, search, and manage files within the project directory securely.', docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', npm: '@modelcontextprotocol/server-filesystem' },
    ],
  },
  {
    tier: 2, name: 'UI/UX & Design', color: 'bg-pink-100 text-pink-700',
    servers: [
      { name: 'Google Stitch', description: 'AI-native design-to-code tool. Generates UI components from design descriptions, maintains DESIGN.md, and ensures design system consistency.', docs: 'https://stitch.withgoogle.com/', npm: '@_davideast/stitch-mcp', envVars: ['STITCH_API_KEY'] },
      { name: 'Shadcn', description: 'Production-ready accessible components. Browse, search, and install shadcn/ui components with proper configuration.', docs: 'https://ui.shadcn.com/', npm: 'shadcn-mcp' },
      { name: '21st.dev Magic', description: 'Modern UI patterns and component generation. AI-powered component creation following current design trends.', docs: 'https://21st.dev/', npm: '@21st-dev/magic-mcp' },
    ],
  },
  {
    tier: 3, name: 'Codebase Intelligence', color: 'bg-indigo-100 text-indigo-700',
    servers: [
      { name: 'TNG.sh', description: 'Framework-aware code auditor. Analyzes codebase for best practices, anti-patterns, and optimization opportunities specific to your stack.', docs: 'https://tng.sh/', npm: '@tng/mcp-server', envVars: ['TNG_API_KEY'] },
      { name: 'Codebase Checkup', description: 'Autonomous codebase health audit. Scans for code quality, security issues, dependency problems, and architecture concerns.', docs: 'https://github.com/alfahadgm/codebase-checkup-mcp', npm: '@alfahadgm/codebase-checkup-mcp' },
      { name: 'Code Indexer', description: 'Local code search and indexing. Fast semantic search across your codebase for functions, classes, and patterns.', docs: 'https://github.com/johnhuang/code-indexer-mcp', npm: '@johnhuang/code-indexer-mcp' },
    ],
  },
  {
    tier: 4, name: 'Security & Quality', color: 'bg-red-100 text-red-700',
    servers: [
      { name: 'Snyk', description: 'Vulnerability scanning for dependencies and code. Identifies known CVEs, suggests fixes, and monitors for new vulnerabilities.', docs: 'https://snyk.io/product/snyk-code/', npm: 'snyk@latest', envVars: ['SNYK_TOKEN'] },
      { name: 'SonarQube', description: 'Code quality analysis. Detects bugs, code smells, security hotspots, and tracks technical debt over time.', docs: 'https://www.sonarsource.com/products/sonarqube/', npm: '@sonarsource/mcp-server-sonarqube', envVars: ['SONAR_TOKEN', 'SONAR_HOST_URL'] },
    ],
  },
  {
    tier: 5, name: 'Task Orchestration', color: 'bg-amber-100 text-amber-700',
    servers: [
      { name: 'Workflows', description: 'YAML-based workflow engine. Define, execute, and monitor multi-step workflows with conditional logic and parallel execution.', docs: 'https://github.com/cyanheads/workflows-mcp-server', npm: '@cyanheads/workflows-mcp-server' },
      { name: 'Task Orchestrator', description: 'Persistent task state management. Track task progress, dependencies, and execution history across sessions.', docs: 'https://github.com/echoingvesper/mcp-task-orchestrator', npm: '@echoingvesper/mcp-task-orchestrator' },
      { name: 'Tasks', description: 'Lightweight task management. Create, update, and track tasks with priorities and status.', docs: 'https://github.com/tasks-mcp/tasks-mcp', npm: 'tasks-mcp' },
      { name: 'Linear', description: 'Issue tracking integration. Create, update, and manage Linear issues, projects, and cycles.', docs: 'https://linear.app/docs', npm: '@linear/mcp', envVars: ['LINEAR_API_KEY'] },
      { name: 'Notion', description: 'Documentation and knowledge base. Read/write Notion pages, databases, and blocks for project documentation.', docs: 'https://developers.notion.com/', npm: '@notionhq/mcp-server', envVars: ['NOTION_API_KEY'] },
    ],
  },
  {
    tier: 6, name: 'GCP Backend', color: 'bg-green-100 text-green-700',
    servers: [
      { name: 'Firebase', description: 'Full Firebase integration. Auth, Firestore, Cloud Functions, Storage, Hosting, and Remote Config management.', docs: 'https://firebase.google.com/docs', npm: '@anthropic-ai/firebase-mcp', envVars: ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_PROJECT_ID'] },
      { name: 'SQLite', description: 'Local database for prototyping. Create, query, and manage SQLite databases for rapid development before migrating to Cloud SQL.', docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite', npm: '@modelcontextprotocol/server-sqlite' },
      { name: 'E2B Sandbox', description: 'Secure cloud code execution. Run untrusted code in isolated sandboxes for testing, evaluation, and prototyping.', docs: 'https://e2b.dev/docs', npm: '@e2b/mcp-server', envVars: ['E2B_API_KEY'] },
    ],
  },
  {
    tier: 7, name: 'Observability', color: 'bg-orange-100 text-orange-700',
    servers: [
      { name: 'Sentry', description: 'Error monitoring and performance tracking. Capture exceptions, monitor transactions, and track release health.', docs: 'https://docs.sentry.io/', npm: '@sentry/mcp-server', envVars: ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG'] },
      { name: 'Datadog', description: 'Infrastructure and application performance monitoring. Metrics, traces, logs, and dashboards.', docs: 'https://docs.datadoghq.com/', npm: '@datadog/mcp-server', envVars: ['DD_API_KEY', 'DD_APP_KEY'] },
    ],
  },
  {
    tier: 8, name: 'Documentation', color: 'bg-cyan-100 text-cyan-700',
    servers: [
      { name: 'Mintlify', description: 'AI-powered documentation generation. Create beautiful API docs, guides, and changelogs from your codebase.', docs: 'https://mintlify.com/docs', npm: '@mintlify/mcp-server' },
      { name: 'AWS Code Doc Gen', description: 'Automated code documentation. Generates comprehensive documentation from source code analysis.', docs: 'https://github.com/aws/code-doc-gen-mcp', npm: '@aws/code-doc-gen-mcp' },
    ],
  },
  {
    tier: 9, name: 'CI/CD', color: 'bg-purple-100 text-purple-700',
    servers: [
      { name: 'GitHub Actions', description: 'CI/CD automation. Create, monitor, and manage GitHub Actions workflows, runs, and artifacts.', docs: 'https://docs.github.com/en/actions', npm: '@github/actions-mcp', envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN'] },
      { name: 'GitLab', description: 'GitLab CI/CD integration. Manage pipelines, merge requests, and repository operations.', docs: 'https://docs.gitlab.com/', npm: '@gitlab/mcp-server', envVars: ['GITLAB_PERSONAL_ACCESS_TOKEN'] },
    ],
  },
  {
    tier: 10, name: 'Data Ingestion', color: 'bg-emerald-100 text-emerald-700',
    servers: [
      { name: 'Firecrawl', description: 'Web scraping and data extraction. Crawl websites, extract structured data, and convert pages to markdown.', docs: 'https://docs.firecrawl.dev/', npm: 'firecrawl-mcp', envVars: ['FIRECRAWL_API_KEY'] },
    ],
  },
];

const GCP_AI_PRODUCTS = [
  {
    name: 'Vertex AI',
    description: 'Google\'s unified AI/ML platform. Model training, tuning, deployment, and serving with Gemini models.',
    api: 'aiplatform.googleapis.com',
    docs: 'https://cloud.google.com/vertex-ai/docs',
    icon: Sparkles,
  },
  {
    name: 'Gemini Enterprise',
    description: 'Enterprise-grade Gemini access. Advanced reasoning, code generation, and multimodal capabilities for production workloads.',
    api: 'generativelanguage.googleapis.com',
    docs: 'https://cloud.google.com/gemini-enterprise',
    icon: Sparkles,
  },
  {
    name: 'CX Agent Studio',
    description: 'Build conversational AI agents with MCP support. 60+ tools for managing apps, agents, guardrails, evaluations, and deployments.',
    api: 'ces.googleapis.com',
    docs: 'https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/reference/mcp',
    icon: Bot,
    mcp: 'https://ces.[REGION].rep.googleapis.com/mcp',
  },
  {
    name: 'Agent Assist',
    description: 'Real-time AI assistance for human agents. Knowledge assist, summarization, smart reply, and coaching features.',
    api: 'dialogflow.googleapis.com',
    docs: 'https://docs.cloud.google.com/customer-engagement-ai',
    icon: Bot,
  },
  {
    name: 'Document AI',
    description: 'Intelligent document processing. Extract structured data from PDFs, forms, invoices, and receipts using pretrained models.',
    api: 'documentai.googleapis.com',
    docs: 'https://cloud.google.com/document-ai/docs',
    icon: Sparkles,
  },
];

const GCP_INFRA_SERVICES = [
  { name: 'Cloud Run', desc: 'Serverless containers — stateless service deployment', api: 'run.googleapis.com' },
  { name: 'Cloud SQL', desc: 'Managed PostgreSQL — connection pooling via Unix sockets', api: 'sqladmin.googleapis.com' },
  { name: 'Firebase Auth', desc: 'Client-facing authentication with Google, email, social', api: 'firebase.googleapis.com' },
  { name: 'Firebase Hosting', desc: 'CDN-backed static hosting with Cloud Run rewrites', api: 'firebasehosting.googleapis.com' },
  { name: 'Secret Manager', desc: 'Production secrets — replaces .env files', api: 'secretmanager.googleapis.com' },
  { name: 'Cloud Build', desc: 'CI/CD pipelines — Docker layer caching with Artifact Registry', api: 'cloudbuild.googleapis.com' },
  { name: 'Cloud Functions', desc: 'Event-driven serverless for mobile backends', api: 'cloudfunctions.googleapis.com' },
  { name: 'Artifact Registry', desc: 'Container image storage for Cloud Run deployments', api: 'artifactregistry.googleapis.com' },
  { name: 'Cloud Logging', desc: 'Centralized logging for all GCP services', api: 'logging.googleapis.com' },
  { name: 'Cloud Monitoring', desc: 'Metrics, dashboards, and alerting', api: 'monitoring.googleapis.com' },
];

const ENV_VARS = [
  { key: 'GCP_PROJECT_ID', category: 'GCP', required: true },
  { key: 'FIREBASE_PROJECT_ID', category: 'GCP', required: true },
  { key: 'GCP_REGION', category: 'GCP', required: true },
  { key: 'GOOGLE_APPLICATION_CREDENTIALS', category: 'GCP', required: true },
  { key: 'GOOGLE_AI_STUDIO_KEY', category: 'AI', required: true },
  { key: 'ANTHROPIC_API_KEY', category: 'AI', required: true },
  { key: 'GITHUB_PERSONAL_ACCESS_TOKEN', category: 'Integrations', required: false },
  { key: 'STITCH_API_KEY', category: 'Integrations', required: false },
  { key: 'SENTRY_AUTH_TOKEN', category: 'Observability', required: false },
  { key: 'LINEAR_API_KEY', category: 'Integrations', required: false },
  { key: 'E2B_API_KEY', category: 'Sandbox', required: false },
  { key: 'FIRECRAWL_API_KEY', category: 'Ingestion', required: false },
];

export default function ConfigPage() {
  const [selectedMCP, setSelectedMCP] = useState<MCPServer | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground mt-1">
          MCP servers, environment variables, GCP services, and Google AI products
        </p>
      </div>

      <Tabs defaultValue="mcp">
        <TabsList>
          <TabsTrigger value="mcp">MCP Servers (28)</TabsTrigger>
          <TabsTrigger value="gcp-ai">Google AI Products</TabsTrigger>
          <TabsTrigger value="env">Environment Variables</TabsTrigger>
          <TabsTrigger value="gcp">GCP Infrastructure</TabsTrigger>
        </TabsList>

        {/* MCP Servers with click-in docs */}
        <TabsContent value="mcp" className="mt-4">
          <div className="grid gap-4">
            {MCP_TIERS.map(tier => (
              <Card key={tier.tier}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-xs font-mono">Tier {tier.tier}</Badge>
                    <h3 className="font-semibold text-sm">{tier.name}</h3>
                    <Badge variant="secondary" className="text-xs">{tier.servers.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {tier.servers.map(server => (
                      <div
                        key={server.name}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                        onClick={() => setSelectedMCP(server)}
                      >
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${tier.color} shrink-0`}>
                          {server.name}
                        </span>
                        <p className="text-xs text-muted-foreground flex-1 line-clamp-1">
                          {server.description}
                        </p>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Google AI Products */}
        <TabsContent value="gcp-ai" className="mt-4">
          <div className="grid gap-4">
            {GCP_AI_PRODUCTS.map(product => {
              const Icon = product.icon;
              return (
                <Card key={product.name} className="bv-card">
                  <CardContent className="py-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" style={{ color: '#1e52f1' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{product.name}</h3>
                          {'mcp' in product && product.mcp && (
                            <Badge className="text-[10px] bg-green-100 text-green-700">MCP Available</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <code className="text-[10px] text-muted-foreground/60">{product.api}</code>
                          <a
                            href={product.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium flex items-center gap-1 hover:underline"
                            style={{ color: '#1e52f1' }}
                          >
                            Docs <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        {'mcp' in product && product.mcp && (
                          <div className="mt-2 p-2 rounded bg-muted">
                            <p className="text-[10px] font-mono text-muted-foreground">
                              MCP Endpoint: {product.mcp}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Environment Variables */}
        <TabsContent value="env" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <div className="space-y-3">
                {ENV_VARS.map(v => (
                  <div key={v.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <code className="text-sm font-mono">{v.key}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{v.category}</Badge>
                      {v.required && <Badge className="text-[10px] bg-red-100 text-red-700">Required</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GCP Infrastructure */}
        <TabsContent value="gcp" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {GCP_INFRA_SERVICES.map(svc => (
              <Card key={svc.name}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="h-4 w-4" style={{ color: '#1e52f1' }} />
                    <p className="font-medium text-sm">{svc.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{svc.desc}</p>
                  <code className="text-[10px] text-muted-foreground/60 block mt-2">{svc.api}</code>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* MCP Detail Dialog */}
      <Dialog open={!!selectedMCP} onOpenChange={() => setSelectedMCP(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMCP?.name}</DialogTitle>
          </DialogHeader>
          {selectedMCP && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedMCP.description}
              </p>

              {selectedMCP.npm && (
                <div>
                  <p className="text-xs font-medium mb-1">Package</p>
                  <code className="text-xs bg-muted px-3 py-1.5 rounded block font-mono">
                    npx -y {selectedMCP.npm}
                  </code>
                </div>
              )}

              {selectedMCP.envVars && selectedMCP.envVars.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Required Environment Variables</p>
                  <div className="space-y-1">
                    {selectedMCP.envVars.map(v => (
                      <code key={v} className="text-xs bg-muted px-3 py-1.5 rounded block font-mono">
                        {v}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <a
                  href={selectedMCP.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium flex items-center gap-1.5 hover:underline"
                  style={{ color: '#1e52f1' }}
                >
                  View Documentation <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
