'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDocumentBuilder, ChatMessage } from '@/hooks/useDocumentBuilder';
import {
  Send,
  Loader2,
  Bot,
  User,
  FileText,
  Save,
  Trash2,
  ArrowLeft,
  PenTool,
  Layers,
  Workflow,
  Layout,
  Database,
  CheckCircle2,
  Sparkles,
  Copy,
  ChevronRight,
  Circle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ARTIFACT_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  starters: string[];
  order: number;
}> = {
  pdb: {
    title: 'Product Design Blueprint',
    subtitle: 'Comprehensive product specification',
    icon: PenTool,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    order: 1,
    starters: [
      "I have an idea for a platform that helps government agencies process citizen applications faster using AI",
      "We need a customer portal for a healthcare provider — patient scheduling, intake forms, and medical records",
      "Build a real-time analytics dashboard for IoT sensor data from smart city infrastructure",
      "I want to create an internal tool for managing grant applications with automated compliance checking",
    ],
  },
  tad: {
    title: 'Technical Architecture',
    subtitle: 'System design & GCP topology',
    icon: Layers,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    order: 2,
    starters: [
      "Design the architecture based on my Product Design Blueprint",
      "I need a microservices architecture on Cloud Run for this multi-tenant platform",
      "Architect the data pipeline — we'll be processing thousands of documents daily",
    ],
  },
  flows: {
    title: 'Process Flows',
    subtitle: 'User flows & system sequences',
    icon: Workflow,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
    order: 3,
    starters: [
      "Map the core user journeys based on the PDB and architecture",
      "Design the document processing pipeline from upload to export",
      "Create the authentication and onboarding flow",
    ],
  },
  wireframes: {
    title: 'Wireframes & UI',
    subtitle: 'Screens, components & design system',
    icon: Layout,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    order: 4,
    starters: [
      "Design the key screens based on the user flows we defined",
      "Create a dashboard layout with the KPI cards and data tables from the PDB",
      "Design the multi-step form wizard for the application intake flow",
    ],
  },
  data_model: {
    title: 'Data Model',
    subtitle: 'Schemas, ERDs & migration plans',
    icon: Database,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    order: 5,
    starters: [
      "Design the data model based on the architecture and process flows",
      "Create the Cloud SQL schema for the entities defined in the PDB",
      "Model the Firestore collections for the real-time features",
    ],
  },
};

const PIPELINE_ORDER = ['pdb', 'tad', 'flows', 'wireframes', 'data_model'];

function DocumentBuilderInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'pdb';
  const config = ARTIFACT_CONFIG[type] || ARTIFACT_CONFIG.pdb;
  const Icon = config.icon;

  const {
    messages,
    document,
    isLoading,
    error,
    isSaving,
    savedPath,
    sendMessage,
    saveDocument,
    clearAll,
  } = useDocumentBuilder(type);

  const [input, setInput] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filename, setFilename] = useState('');
  const [upstreamStatus, setUpstreamStatus] = useState<Record<string, { exists: boolean; files: string[] }>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load upstream artifact status
  useEffect(() => {
    fetch('/api/design')
      .then(r => r.json())
      .then(data => setUpstreamStatus(data.artifacts || {}))
      .catch(() => {});
  }, [savedPath]); // refresh after saving

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSave = () => {
    if (!filename.trim()) return;
    saveDocument(filename.trim());
    setShowSaveDialog(false);
  };

  const copyDocument = () => {
    navigator.clipboard.writeText(document);
  };

  // Determine which upstream docs are available for current artifact
  const currentIndex = PIPELINE_ORDER.indexOf(type);
  const upstreamTypes = PIPELINE_ORDER.slice(0, currentIndex);
  const hasUpstream = upstreamTypes.some(t => upstreamStatus[t]?.exists);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Pipeline Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-3">
          {PIPELINE_ORDER.map((pType, i) => {
            const pConfig = ARTIFACT_CONFIG[pType];
            const PIcon = pConfig.icon;
            const isCurrent = pType === type;
            const isComplete = upstreamStatus[pType]?.exists;
            const isPast = i < currentIndex;

            return (
              <div key={pType} className="flex items-center gap-1">
                <Link href={`/design/create?type=${pType}`}>
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                      isCurrent
                        ? `${pConfig.bgColor} ${pConfig.color} ring-2 ${pConfig.borderColor}`
                        : isComplete
                        ? 'bg-green-50 text-green-700'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : isCurrent ? (
                      <PIcon className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                    <span className="hidden sm:inline">{pConfig.title}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                </Link>
                {i < PIPELINE_ORDER.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* Upstream context indicator */}
        {hasUpstream && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs">
            <Sparkles className="h-3 w-3 text-green-600" />
            <span className="text-green-700 font-medium">Building on:</span>
            {upstreamTypes.filter(t => upstreamStatus[t]?.exists).map(t => (
              <Badge key={t} variant="secondary" className="text-[10px] bg-green-100 text-green-700">
                {ARTIFACT_CONFIG[t]?.title}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href="/design">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ArrowLeft className="h-3 w-3" /> Design Hub
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{config.title}</h1>
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedPath && (
            <Badge variant="secondary" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Saved
            </Badge>
          )}
          {document && (
            <>
              <Button variant="ghost" size="sm" onClick={copyDocument} className="text-xs gap-1">
                <Copy className="h-3 w-3" /> Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="text-xs gap-1"
              >
                <Save className="h-3 w-3" /> Save
              </Button>
            </>
          )}
          {document && currentIndex < PIPELINE_ORDER.length - 1 && savedPath && (
            <Link href={`/design/create?type=${PIPELINE_ORDER[currentIndex + 1]}`}>
              <Button size="sm" className="text-xs gap-1" style={{ backgroundColor: '#1e52f1' }}>
                Next: {ARTIFACT_CONFIG[PIPELINE_ORDER[currentIndex + 1]]?.title}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left: Chat */}
        <div className="w-1/2 flex flex-col min-h-0">
          <Card className="flex-1 min-h-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/20 mb-3" />
                    {type === 'pdb' ? (
                      <>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Let&apos;s build your product blueprint
                        </p>
                        <p className="text-xs text-muted-foreground mb-5 max-w-sm">
                          I&apos;ll guide you through a structured interview to capture every aspect of your product.
                          Start by describing your idea, or pick a prompt below.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Build your {config.title.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mb-5 max-w-sm">
                          {hasUpstream
                            ? `I'll use your existing design documents as context to build this artifact.`
                            : `For best results, complete the Product Design Blueprint first.`
                          }
                        </p>
                      </>
                    )}
                    <div className="grid gap-2 w-full max-w-md">
                      {config.starters.map(starter => (
                        <button
                          key={starter}
                          className="text-left text-xs px-3 py-2.5 rounded-lg border hover:bg-accent transition-colors leading-relaxed"
                          onClick={() => {
                            setInput(starter);
                            sendMessage(starter);
                          }}
                        >
                          {starter}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                )}

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    type === 'pdb'
                      ? "Describe your product idea, answer questions, or add details..."
                      : "Describe requirements, refine sections, or ask questions..."
                  }
                  className="resize-none min-h-[44px] max-h-[100px] text-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="shrink-0 h-auto"
                  style={{ backgroundColor: '#1e52f1' }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Right: Live Document */}
        <div className="w-1/2 flex flex-col min-h-0">
          <Card className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {document ? config.title : 'Document Preview'}
                </span>
              </div>
              {document && (
                <Badge variant="secondary" className="text-[10px]">
                  {document.split('\n').length} lines
                </Badge>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-5">
                {document ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {document}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-muted-foreground">
                    <FileText className="h-12 w-12 opacity-10 mb-3" />
                    <p className="text-sm font-medium">Document will build here</p>
                    <p className="text-xs mt-1 max-w-xs">
                      {type === 'pdb'
                        ? "As we go through the interview, each answer adds to your Product Design Blueprint"
                        : `Your ${config.title.toLowerCase()} will take shape as you provide requirements`
                      }
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save {config.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Saving to <code className="bg-muted px-1 py-0.5 rounded">{
                  type === 'pdb' ? 'docs/product_design/' :
                  type === 'tad' ? 'docs/architecture/' :
                  type === 'flows' ? 'docs/flows/' :
                  type === 'wireframes' ? 'docs/wireframes/' :
                  'docs/data_model/'
                }</code>
              </p>
              <Input
                placeholder="my-project-blueprint"
                value={filename}
                onChange={e => setFilename(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground mt-1">.md extension added automatically</p>
            </div>
            {currentIndex < PIPELINE_ORDER.length - 1 && (
              <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-xs text-blue-700">
                <Sparkles className="h-3 w-3 shrink-0" />
                After saving, this document becomes context for: {
                  PIPELINE_ORDER.slice(currentIndex + 1).map(t => ARTIFACT_CONFIG[t]?.title).join(', ')
                }
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!filename.trim() || isSaving}
                style={{ backgroundColor: '#1e52f1' }}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
          style={{ backgroundColor: 'rgba(30, 82, 241, 0.1)' }}
        >
          <Bot className="h-4 w-4" style={{ color: '#1e52f1' }} />
        </div>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2.5 max-w-[85%] text-sm',
          isUser ? 'text-white' : 'bg-muted'
        )}
        style={isUser ? { backgroundColor: '#1e52f1' } : undefined}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-current animate-pulse ml-0.5" />
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function CreateDesignPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>}>
      <DocumentBuilderInner />
    </Suspense>
  );
}
