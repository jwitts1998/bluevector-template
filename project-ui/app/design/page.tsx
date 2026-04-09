'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Palette,
  PenTool,
  Workflow,
  ArrowRight,
  Lightbulb,
  Layers,
  Database,
  Layout,
  Plus,
  Bot,
  CheckCircle2,
  Circle,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';

const PIPELINE = [
  {
    id: 'pdb',
    title: 'Product Design Blueprint',
    description: 'Comprehensive product specification including user personas, journey maps, feature matrix, and success metrics',
    icon: PenTool,
    agent: '@idea-to-pdb',
    outputDir: 'docs/product_design/',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    upstream: [],
  },
  {
    id: 'tad',
    title: 'Technical Architecture Design',
    description: 'System architecture, GCP service topology, data flow diagrams, API contracts, and infrastructure decisions',
    icon: Layers,
    agent: '@context-to-pdb',
    outputDir: 'docs/architecture/',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    upstream: ['pdb'],
  },
  {
    id: 'flows',
    title: 'Process Flow Diagrams',
    description: 'User flows, system sequence diagrams, state machines, and business process models',
    icon: Workflow,
    agent: '@designer',
    outputDir: 'docs/flows/',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    upstream: ['pdb', 'tad'],
  },
  {
    id: 'wireframes',
    title: 'Wireframes & UI Concepts',
    description: 'Low/high-fidelity wireframes, component library, design system tokens, and interactive prototypes',
    icon: Layout,
    agent: '@stitch-specialist',
    outputDir: 'docs/wireframes/',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    upstream: ['pdb', 'flows'],
  },
  {
    id: 'data_model',
    title: 'Data Model Design',
    description: 'Entity relationship diagrams, Cloud SQL schema design, Firestore collections, and data migration plans',
    icon: Database,
    agent: '@schema-data',
    outputDir: 'docs/data_model/',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    upstream: ['pdb', 'tad', 'flows'],
  },
];

const DESIGN_TOOLS = [
  { name: 'Google Stitch', description: 'AI-native design-to-code', status: 'configured' },
  { name: 'Shadcn UI', description: 'Production-ready components', status: 'configured' },
  { name: '21st.dev Magic', description: 'Modern UI patterns', status: 'configured' },
  { name: 'A2UI Framework', description: 'Agent-generated UI', status: 'available' },
];

export default function DesignPage() {
  const router = useRouter();
  const [artifactStatus, setArtifactStatus] = useState<Record<string, { exists: boolean; files: string[] }>>({});

  useEffect(() => {
    fetch('/api/design')
      .then(r => r.json())
      .then(data => setArtifactStatus(data.artifacts || {}))
      .catch(() => {});
  }, []);

  const completedCount = PIPELINE.filter(a => artifactStatus[a.id]?.exists).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design & Ideation</h1>
          <p className="text-muted-foreground mt-1">
            Progressive refinement pipeline — from concept to buildable specification
          </p>
        </div>
        <Badge className="phase-badge phase-badge-design">Phase 2</Badge>
      </div>

      {/* Pipeline Progress */}
      <Card className="bv-gradient-bg border-[rgba(30,82,241,0.1)]">
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: '#1e52f1' }} />
              <p className="font-semibold text-sm">Design Pipeline</p>
            </div>
            <Badge variant="secondary" className="text-xs">{completedCount}/{PIPELINE.length} complete</Badge>
          </div>
          <div className="flex items-center gap-1">
            {PIPELINE.map((artifact, i) => {
              const isComplete = artifactStatus[artifact.id]?.exists;
              const Icon = artifact.icon;
              return (
                <div key={artifact.id} className="flex items-center gap-1">
                  <Link href={`/design/create?type=${artifact.id}`}>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isComplete
                          ? 'bg-green-100 text-green-700'
                          : `${artifact.bgColor} ${artifact.color}`
                      } hover:opacity-80`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden lg:inline">{artifact.title}</span>
                      <span className="lg:hidden">{i + 1}</span>
                    </div>
                  </Link>
                  {i < PIPELINE.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Each artifact builds on the ones before it. Start with the Product Design Blueprint — downstream artifacts will automatically use it as context.
          </p>
        </CardContent>
      </Card>

      {/* Guided Interview CTA */}
      {!artifactStatus['pdb']?.exists && (
        <Card className="border-sky-200 bg-sky-50/30">
          <CardContent className="py-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <Lightbulb className="h-6 w-6 text-sky-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Start with the Guided Interview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Describe your idea and I&apos;ll walk you through a structured discovery process —
                  product definition, feature scoping, technical requirements, and business context.
                  The result becomes the foundation for everything downstream.
                </p>
                <Link href="/design/create?type=pdb">
                  <Button className="mt-3 gap-1" style={{ backgroundColor: '#1e52f1' }}>
                    <Sparkles className="h-4 w-4" /> Begin Product Discovery
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Design Artifacts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Design Artifacts</h2>
        <div className="grid gap-4">
          {PIPELINE.map((artifact, i) => {
            const Icon = artifact.icon;
            const isComplete = artifactStatus[artifact.id]?.exists;
            const upstreamComplete = artifact.upstream.every(u => artifactStatus[u]?.exists);
            const isBlocked = artifact.upstream.length > 0 && !upstreamComplete;

            return (
              <Card
                key={artifact.id}
                className={`transition-all ${isBlocked ? 'opacity-60' : 'hover:shadow-sm'}`}
              >
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`h-10 w-10 rounded-lg ${isComplete ? 'bg-green-50' : artifact.bgColor} flex items-center justify-center shrink-0`}>
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isBlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground/40" />
                        ) : (
                          <Icon className={`h-5 w-5 ${artifact.color}`} />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{i + 1}/5</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{artifact.title}</h3>
                        {isComplete && (
                          <Badge className="text-[10px] bg-green-100 text-green-700">Complete</Badge>
                        )}
                        {isBlocked && (
                          <Badge variant="secondary" className="text-[10px]">
                            Needs: {artifact.upstream.filter(u => !artifactStatus[u]?.exists).map(u =>
                              PIPELINE.find(p => p.id === u)?.title
                            ).join(', ')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {artifact.description}
                      </p>
                      {isComplete && artifactStatus[artifact.id]?.files.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {artifactStatus[artifact.id].files.map(f => (
                            <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          <Bot className="h-3 w-3 mr-1" />
                          {artifact.agent}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          Output: {artifact.outputDir}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={isComplete ? 'outline' : 'default'}
                      size="sm"
                      className="shrink-0 text-xs gap-1"
                      style={!isComplete && !isBlocked ? { backgroundColor: '#1e52f1' } : undefined}
                      disabled={isBlocked}
                      onClick={() => router.push(`/design/create?type=${artifact.id}`)}
                    >
                      {isComplete ? (
                        <>Edit</>
                      ) : (
                        <><Plus className="h-3 w-3" /> Create</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Design Tools */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Design Tools (MCP)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DESIGN_TOOLS.map(tool => (
            <Card key={tool.name}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{tool.name}</p>
                  <Badge
                    variant={tool.status === 'configured' ? 'default' : 'secondary'}
                    className="text-[10px]"
                  >
                    {tool.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Phase */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Design Complete?</p>
            <p className="text-xs text-muted-foreground">
              Once your design artifacts are ready, move to Planning to generate epics, stories, and tasks for AI execution
            </p>
          </div>
          <Link href="/planning">
            <Button size="sm" className="gap-1 bg-amber-600 hover:bg-amber-700">
              Phase 3: Planning <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
