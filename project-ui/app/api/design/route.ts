import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { NextRequest } from 'next/server';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';

const PROJECT_ROOT = process.env.PROJECT_ROOT || join(process.cwd(), '..');

interface ArtifactConfig {
  role: string;
  sections: string[];
  outputDir: string;
  upstream: string[]; // artifact types that feed into this one
}

const ARTIFACT_PROMPTS: Record<string, ArtifactConfig> = {
  pdb: {
    role: 'Product Design Blueprint Architect',
    sections: [
      'Executive Summary',
      'Problem Statement',
      'User Personas',
      'User Journey Maps',
      'Feature Matrix (MVP vs Future)',
      'Information Architecture',
      'Success Metrics & KPIs',
      'Technical Constraints',
      'Risk Assessment',
      'Phased Rollout Plan',
    ],
    outputDir: 'docs/product_design',
    upstream: [],
  },
  tad: {
    role: 'Technical Architecture Designer',
    sections: [
      'System Overview',
      'GCP Service Topology',
      'Data Flow Diagrams',
      'API Contracts',
      'Authentication & Authorization',
      'Database Schema Design',
      'Infrastructure Decisions',
      'Scalability Strategy',
      'Security Architecture',
      'Cost Estimation',
    ],
    outputDir: 'docs/architecture',
    upstream: ['pdb'],
  },
  flows: {
    role: 'Process Flow Designer',
    sections: [
      'User Flow Overview',
      'Core User Journeys',
      'System Sequence Diagrams',
      'State Machine Definitions',
      'Error Handling Flows',
      'Integration Touchpoints',
      'Event-Driven Flows',
    ],
    outputDir: 'docs/flows',
    upstream: ['pdb', 'tad'],
  },
  wireframes: {
    role: 'UI/UX Designer',
    sections: [
      'Design System Tokens',
      'Component Library',
      'Screen Inventory',
      'Layout Patterns',
      'Navigation Structure',
      'Responsive Breakpoints',
      'Interaction Patterns',
      'Accessibility Requirements',
    ],
    outputDir: 'docs/wireframes',
    upstream: ['pdb', 'flows'],
  },
  data_model: {
    role: 'Data Architect',
    sections: [
      'Entity Overview',
      'Entity Relationship Diagram',
      'Cloud SQL Schema',
      'Firestore Collections',
      'Data Migration Plan',
      'Indexing Strategy',
      'Data Validation Rules',
      'Backup & Recovery',
    ],
    outputDir: 'docs/data_model',
    upstream: ['pdb', 'tad', 'flows'],
  },
};

// Interview questions for PDB — the entry point
const INTERVIEW_PHASES = [
  {
    phase: 'discovery',
    title: 'Product Discovery',
    questions: [
      { id: 'idea', question: "What's the core idea? In a sentence or two, what are we building and what problem does it solve?", probes: ['Who experiences this problem?', 'How urgent is this problem?'] },
      { id: 'users', question: "Who are the primary users of this product? Describe 1-3 user types and what they need.", probes: ['What\'s their technical sophistication?', 'How do they discover and access the product?'] },
      { id: 'current_state', question: "What do these users do today without this product? What's the current workflow or workaround?", probes: ['Where are the biggest pain points?', 'What tools do they currently use?'] },
      { id: 'success', question: "What does success look like? If this product works perfectly, what changes for the users and the business?", probes: ['How would you measure success?', 'What KPIs matter most?'] },
    ],
  },
  {
    phase: 'scoping',
    title: 'Feature Scoping',
    questions: [
      { id: 'mvp_features', question: "What are the absolute must-have features for a v1 launch? List the core capabilities.", probes: ['Which single feature is the most critical?', 'What can wait for v2?'] },
      { id: 'integrations', question: "Does this product need to integrate with any existing systems, APIs, or data sources?", probes: ['Any third-party services?', 'Authentication requirements (SSO, OAuth)?'] },
      { id: 'ai_features', question: "What role should AI play in this product? Any specific AI/ML capabilities needed (document processing, chat, recommendations, etc.)?", probes: ['Should AI be user-facing or behind the scenes?', 'What data will the AI need access to?'] },
    ],
  },
  {
    phase: 'technical',
    title: 'Technical Requirements',
    questions: [
      { id: 'platform', question: "What platforms do we need to support — web, mobile, or both? Any specific device requirements?", probes: ['Offline support needed?', 'Progressive web app?'] },
      { id: 'scale', question: "What's the expected scale? How many users, how much data, and what's the growth trajectory?", probes: ['Peak usage patterns?', 'Geographic distribution?'] },
      { id: 'compliance', question: "Are there any compliance, security, or regulatory requirements (HIPAA, FedRAMP, SOC2, ADA, etc.)?", probes: ['Data residency requirements?', 'Audit trail needs?'] },
      { id: 'realtime', question: "Does the product need real-time capabilities (live updates, notifications, collaboration, chat)?", probes: ['What needs to be instant vs near-real-time?'] },
    ],
  },
  {
    phase: 'business',
    title: 'Business Context',
    questions: [
      { id: 'stakeholders', question: "Who are the key stakeholders and decision-makers for this project?", probes: ['Who approves the design?', 'Who owns the product post-launch?'] },
      { id: 'timeline', question: "What's the timeline? Any hard deadlines or milestones we need to hit?", probes: ['Is there a demo or pilot date?'] },
      { id: 'constraints', question: "Any other constraints or context I should know about — budget, team size, existing tech stack, organizational factors?", probes: ['Preferred technologies?', 'Team expertise?'] },
    ],
  },
];

async function loadUpstreamContext(artifactType: string): Promise<string> {
  const config = ARTIFACT_PROMPTS[artifactType];
  if (!config || config.upstream.length === 0) return '';

  const contexts: string[] = [];

  for (const upstreamType of config.upstream) {
    const upstreamConfig = ARTIFACT_PROMPTS[upstreamType];
    if (!upstreamConfig) continue;

    const dir = join(PROJECT_ROOT, upstreamConfig.outputDir);
    try {
      const files = await readdir(dir);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      for (const file of mdFiles) {
        const content = await readFile(join(dir, file), 'utf-8');
        contexts.push(`## Upstream: ${upstreamType.toUpperCase()} — ${file}\n\n${content}`);
      }
    } catch {
      // Directory doesn't exist yet
    }
  }

  if (contexts.length === 0) return '';

  return `\n\n## UPSTREAM CONTEXT (from completed design artifacts)\n\nThe following design documents have already been completed. Use them as foundational context — don't contradict them, build on them.\n\n${contexts.join('\n\n---\n\n')}`;
}

export async function POST(request: NextRequest) {
  const { message, history = [], artifactType, document = '', interviewPhase } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is required. Set it in project-ui/.env.local' }),
      { status: 500 }
    );
  }

  const config = ARTIFACT_PROMPTS[artifactType] || ARTIFACT_PROMPTS.pdb;
  const upstreamContext = await loadUpstreamContext(artifactType);

  // Build interview context for PDB
  let interviewInstructions = '';
  if (artifactType === 'pdb' || !artifactType) {
    interviewInstructions = `
## Guided Interview Mode

You are conducting a guided product discovery interview. Your approach is 70% structured interview, 30% freeform exploration.

### Interview Structure
${INTERVIEW_PHASES.map(phase => `
**${phase.title}**
${phase.questions.map(q => `- ${q.question}`).join('\n')}`).join('\n')}

### How to Conduct the Interview
1. **Start with the current phase's questions** — ask ONE question at a time
2. **Listen and probe deeper** — when the user answers, acknowledge their response, note what's useful, and ask a follow-up probe if their answer was too shallow
3. **Don't move to the next question until the current one is adequately answered**
4. **After each answer, update the document** with what you've learned
5. **When a phase is complete**, summarize what was captured and announce the next phase
6. **Allow freeform tangents** — if the user goes off-script with useful info, capture it and weave it into the document, then gently guide back
7. **Be opinionated** — suggest GCP-specific solutions, recommend architectural patterns, flag potential risks
8. **Track progress** — at the top of each response, show which phase you're in and how many questions remain

### Current Interview State
Phase: ${interviewPhase || 'discovery'} (${INTERVIEW_PHASES.findIndex(p => p.phase === (interviewPhase || 'discovery')) + 1}/${INTERVIEW_PHASES.length})

### Response Format
Start your response with a brief phase indicator like:
**[Discovery — Question 2/4]**

Then respond conversationally, and end with the document update.`;
  }

  const systemPrompt = `You are a ${config.role} for BlueVector.AI, a Google Cloud implementation partner.

## Your Mission
You are helping transform an idea in someone's head into a structured design document through intelligent conversation. This document will become the "brain" that drives AI-powered software development — Claude Code will use these artifacts to actually build the product.

${interviewInstructions}

## Document Format
After your conversational response, output the FULL updated document between these exact markers:

---DOCUMENT_START---
(full markdown document here)
---DOCUMENT_END---

## Document Sections
Build these sections progressively as the conversation develops:
${config.sections.map((s, i) => `${i + 1}. **${s}**`).join('\n')}

## Rules
- Start with whatever sections the user's input naturally informs — don't force all sections immediately
- Each response should ADD to or REFINE the document, never remove content unless asked
- Use proper markdown: headers (##), bullet lists, tables, code blocks
- For GCP projects, always reference specific services (Cloud Run, Cloud SQL, Firebase Auth, etc.)
- Mark incomplete sections with "[Pending: need input on X]" so gaps are visible
- When the interview is complete, the document should be comprehensive enough for a Technical Architecture Design to be derived from it
- This document will be read by AI agents to generate code — be precise, specific, and unambiguous

## Current Document State
${document || '(Empty — starting fresh)'}
${upstreamContext}

## GCP Default Stack Reference
- Compute: Cloud Run (serverless containers) or Cloud Functions (event-driven)
- Database: Cloud SQL (PostgreSQL) for relational, Firestore for real-time/mobile
- Auth: Firebase Auth (Google, email, social providers)
- Hosting: Firebase Hosting (CDN-backed, Cloud Run rewrites for SSR)
- Secrets: Secret Manager (never .env in production)
- CI/CD: Cloud Build + Artifact Registry
- Monitoring: Cloud Logging + Cloud Monitoring + Error Reporting
- AI/ML: Vertex AI, Gemini API, Document AI`;

  const messages = [
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ];

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}

// Save document endpoint
export async function PUT(request: NextRequest) {
  const { artifactType, document, filename } = await request.json();

  if (!document || !artifactType) {
    return new Response(JSON.stringify({ error: 'document and artifactType required' }), { status: 400 });
  }

  const config = ARTIFACT_PROMPTS[artifactType] || ARTIFACT_PROMPTS.pdb;
  const outputDir = join(PROJECT_ROOT, config.outputDir);
  const safeName = (filename || `${artifactType}-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
  const filePath = join(outputDir, `${safeName}.md`);

  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(filePath, document, 'utf-8');
    return new Response(JSON.stringify({
      success: true,
      path: `${config.outputDir}/${safeName}.md`,
    }));
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to save document' }),
      { status: 500 }
    );
  }
}

// Get upstream context status
export async function GET() {
  const status: Record<string, { exists: boolean; files: string[] }> = {};

  for (const [type, config] of Object.entries(ARTIFACT_PROMPTS)) {
    const dir = join(PROJECT_ROOT, config.outputDir);
    try {
      const files = await readdir(dir);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      status[type] = { exists: mdFiles.length > 0, files: mdFiles };
    } catch {
      status[type] = { exists: false, files: [] };
    }
  }

  return new Response(JSON.stringify({ artifacts: status, pipeline: INTERVIEW_PHASES }));
}
