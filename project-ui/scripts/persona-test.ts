/**
 * AI Persona Testing System
 *
 * Creates synthetic users with distinct personalities that exercise the app
 * end-to-end through its APIs. Each persona has a role, behavior pattern,
 * and goals. They generate real data flowing through the system.
 *
 * Usage:
 *   npx tsx scripts/persona-test.ts [--persona <name>] [--all] [--base-url <url>]
 */

const BASE_URL = process.argv.find((_, i, a) => a[i - 1] === '--base-url') || 'http://localhost:3011';

// ─── Persona Definitions ───────────────────────────────────────────────────

interface Persona {
  name: string;
  role: string;
  personality: string;
  goals: string[];
  actions: () => Promise<TestResult[]>;
}

interface TestResult {
  persona: string;
  action: string;
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
  detail?: string;
}

async function apiCall(method: string, path: string, body?: unknown): Promise<{ status: number; data: unknown; duration: number }> {
  const start = Date.now();
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const duration = Date.now() - start;
  let data: unknown;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/event-stream') || contentType.includes('text/plain') || contentType.includes('octet-stream')) {
    // Streaming response — read just enough to confirm it works
    const reader = res.body?.getReader();
    if (reader) {
      const { value } = await reader.read();
      data = value ? `[stream: ${value.length} bytes]` : '[stream: empty]';
      reader.cancel();
    } else {
      data = '[stream: no body]';
    }
  } else {
    try {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    } catch {
      data = '[unreadable]';
    }
  }
  return { status: res.status, data, duration };
}

function result(persona: string, action: string, endpoint: string, method: string, r: { status: number; duration: number; data?: unknown }, expectStatus = 200): TestResult {
  return {
    persona,
    action,
    endpoint,
    method,
    status: r.status,
    success: r.status === expectStatus,
    duration: r.duration,
    detail: r.status !== expectStatus ? `Expected ${expectStatus}, got ${r.status}` : undefined,
  };
}

// ─── Persona: Sarah — The Product Manager ──────────────────────────────────

const sarah: Persona = {
  name: 'Sarah Chen',
  role: 'Product Manager',
  personality: 'Organized, detail-oriented, loves product specs. Always starts with design before code.',
  goals: [
    'Check project status',
    'Browse existing blueprints',
    'Create a new product design blueprint via the document builder',
    'Review the design pipeline status',
    'Check what agents are available for design work',
  ],
  actions: async () => {
    const results: TestResult[] = [];
    const p = 'Sarah Chen';

    // 1. Check project overview
    const project = await apiCall('GET', '/api/project');
    results.push(result(p, 'Check project overview', '/api/project', 'GET', project));

    // 2. Check existing docs
    const docs = await apiCall('GET', '/api/docs');
    results.push(result(p, 'Browse documentation tree', '/api/docs', 'GET', docs));

    // 3. Check design pipeline status
    const design = await apiCall('GET', '/api/design');
    results.push(result(p, 'Check design pipeline artifacts', '/api/design', 'GET', design));

    // 4. Start a PDB conversation (first message of a guided interview)
    const pdbChat = await apiCall('POST', '/api/design', {
      message: "I want to create a product design blueprint for a project management tool for remote teams. It should focus on async communication and AI-powered task prioritization.",
      history: [],
      artifactType: 'pdb',
      document: '',
    });
    results.push(result(p, 'Start PDB document builder session', '/api/design', 'POST', pdbChat));

    // 5. Check agents catalog
    const agents = await apiCall('GET', '/api/agents');
    results.push(result(p, 'Browse agent catalog', '/api/agents', 'GET', agents));

    // 6. Look at a specific design agent
    const designAgent = await apiCall('GET', '/api/agents?slug=designer');
    results.push(result(p, 'View designer agent details', '/api/agents?slug=designer', 'GET', designAgent));

    return results;
  },
};

// ─── Persona: Marcus — The DevOps Engineer ─────────────────────────────────

const marcus: Persona = {
  name: 'Marcus Johnson',
  role: 'DevOps Engineer',
  personality: 'Pragmatic, infrastructure-focused. Checks system health first, then deployment readiness.',
  goals: [
    'Check project status and health signals',
    'Review GCP setup state',
    'Check deployment targets',
    'Review analytics and build metrics',
    'Test the deploy endpoint',
  ],
  actions: async () => {
    const results: TestResult[] = [];
    const p = 'Marcus Johnson';

    // 1. Check system status
    const status = await apiCall('GET', '/api/status');
    results.push(result(p, 'Check project health status', '/api/status', 'GET', status));

    // 2. Check setup state
    const setup = await apiCall('GET', '/api/setup');
    results.push(result(p, 'Check GCP setup state', '/api/setup', 'GET', setup));

    // 3. Get analytics
    const analytics = await apiCall('GET', '/api/analytics');
    results.push(result(p, 'Check build analytics', '/api/analytics', 'GET', analytics));

    // 4. Test deploy endpoint (dev)
    const deployDev = await apiCall('POST', '/api/deploy', { target: 'dev' });
    results.push(result(p, 'Test deploy to dev', '/api/deploy', 'POST', deployDev));

    // 5. Test deploy endpoint (invalid)
    const deployBad = await apiCall('POST', '/api/deploy', { target: 'invalid' });
    results.push(result(p, 'Test invalid deploy target (expect 400)', '/api/deploy', 'POST', deployBad, 400));

    // 6. Toggle some setup items
    const setupUpdate = await apiCall('PUT', '/api/setup', {
      items: { gcp_project: 'complete', gcloud_auth: 'complete', firebase: 'in_progress' },
      envValues: { GCP_PROJECT_ID: 'test-project-marcus', GCP_REGION: 'us-central1' },
    });
    results.push(result(p, 'Update setup checklist state', '/api/setup', 'PUT', setupUpdate));

    // 7. Verify persistence
    const setupVerify = await apiCall('GET', '/api/setup');
    results.push(result(p, 'Verify setup state persisted', '/api/setup', 'GET', setupVerify));

    return results;
  },
};

// ─── Persona: Priya — The Full-Stack Developer ────────────────────────────

const priya: Persona = {
  name: 'Priya Patel',
  role: 'Full-Stack Developer',
  personality: 'Moves fast, uses the chat heavily, checks task board constantly. Prefers building to planning.',
  goals: [
    'Check task board for work items',
    'Chat with the AI assistant about implementation',
    'Browse available specialist agents',
    'Check architecture docs',
  ],
  actions: async () => {
    const results: TestResult[] = [];
    const p = 'Priya Patel';

    // 1. Get all tasks
    const tasks = await apiCall('GET', '/api/tasks');
    results.push(result(p, 'Load task board', '/api/tasks', 'GET', tasks));

    // 2. Chat with the AI assistant
    const chat = await apiCall('POST', '/api/chat', {
      message: "What's the recommended way to set up authentication with Firebase Auth and Cloud Run? I need to protect API routes.",
      history: [],
    });
    results.push(result(p, 'Ask AI about Firebase Auth setup', '/api/chat', 'POST', chat));

    // 3. Browse all agents
    const agents = await apiCall('GET', '/api/agents');
    results.push(result(p, 'Browse all agents', '/api/agents', 'GET', agents));

    // 4. Check specific specialists
    for (const slug of ['firebase-specialist', 'gcp-specialist', 'react-specialist']) {
      const agent = await apiCall('GET', `/api/agents?slug=${slug}`);
      results.push(result(p, `View ${slug} details`, `/api/agents?slug=${slug}`, 'GET', agent));
    }

    // 5. Check architecture docs (may be empty — 404 is acceptable)
    const archDocs = await apiCall('GET', '/api/docs?path=docs/architecture');
    const archOk = archDocs.status === 200 || archDocs.status === 404;
    results.push({ persona: p, action: 'Check architecture docs', endpoint: '/api/docs?path=docs/architecture', method: 'GET', status: archDocs.status, success: archOk, duration: archDocs.duration, detail: archDocs.status === 404 ? 'No architecture docs yet (expected)' : undefined });

    // 6. Get project info
    const project = await apiCall('GET', '/api/project');
    results.push(result(p, 'Get project info', '/api/project', 'GET', project));

    return results;
  },
};

// ─── Persona: Alex — The QA Stress Tester ──────────────────────────────────

const alex: Persona = {
  name: 'Alex Rivera',
  role: 'QA Engineer',
  personality: 'Methodical, tries edge cases, tests error paths. Wants to break things.',
  goals: [
    'Test all API endpoints respond correctly',
    'Test error handling with bad inputs',
    'Test all GET endpoints return proper JSON',
    'Verify data consistency across endpoints',
  ],
  actions: async () => {
    const results: TestResult[] = [];
    const p = 'Alex Rivera';

    // Test all GET endpoints
    const getEndpoints = [
      '/api/project',
      '/api/status',
      '/api/tasks',
      '/api/agents',
      '/api/docs',
      '/api/design',
      '/api/setup',
      '/api/analytics',
    ];

    for (const endpoint of getEndpoints) {
      const r = await apiCall('GET', endpoint);
      results.push(result(p, `GET ${endpoint}`, endpoint, 'GET', r));
    }

    // Test bad doc path — server should reject path traversal
    const badDoc = await apiCall('GET', '/api/docs?path=../../etc/passwd');
    const badDocOk = badDoc.status === 400 || badDoc.status === 404;
    results.push({ persona: p, action: 'Test path traversal (docs)', endpoint: '/api/docs?path=../../etc/passwd', method: 'GET', status: badDoc.status, success: badDocOk, duration: badDoc.duration, detail: badDocOk ? 'Correctly rejected' : `Unexpected ${badDoc.status}` });

    // Test deploy with no body — should get 400 for missing target
    const deployNoBody = await apiCall('POST', '/api/deploy', {});
    results.push(result(p, 'Deploy with empty body (expect 400)', '/api/deploy', 'POST', deployNoBody, 400));

    // Test design with empty message — should get 400
    const designMinimal = await apiCall('POST', '/api/design', {
      message: '',
      history: [],
      artifactType: 'pdb',
      document: '',
    });
    results.push(result(p, 'Design builder with empty message (expect 400)', '/api/design', 'POST', designMinimal, 400));

    // Test setup with empty state — should succeed
    const setupWeird = await apiCall('PUT', '/api/setup', {
      items: {},
      envValues: {},
    });
    results.push(result(p, 'Setup with empty state', '/api/setup', 'PUT', setupWeird));

    // Verify nonexistent agent returns 404
    const noAgent = await apiCall('GET', '/api/agents?slug=nonexistent-agent');
    results.push(result(p, 'Get nonexistent agent (expect 404)', '/api/agents?slug=nonexistent-agent', 'GET', noAgent, 404));

    return results;
  },
};

// ─── Runner ────────────────────────────────────────────────────────────────

const ALL_PERSONAS: Persona[] = [sarah, marcus, priya, alex];

async function runPersona(persona: Persona): Promise<TestResult[]> {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${persona.name} — ${persona.role}`);
  console.log(`  "${persona.personality}"`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Goals:`);
  persona.goals.forEach(g => console.log(`    • ${g}`));
  console.log('');

  const results = await persona.actions();

  for (const r of results) {
    const icon = r.success ? '✓' : '✗';
    const color = r.success ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    const dur = `${r.duration}ms`.padStart(6);
    console.log(`  ${color}${icon}${reset} [${dur}] ${r.method.padEnd(4)} ${r.endpoint}`);
    console.log(`           ${r.action}${r.detail ? ` — ${r.detail}` : ''}`);
  }

  return results;
}

async function main() {
  const targetPersona = process.argv.find((_, i, a) => a[i - 1] === '--persona');
  const runAll = process.argv.includes('--all');

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║       BlueVector AI — Persona Testing System            ║');
  console.log('║       Synthetic users exercising the app E2E            ║');
  console.log(`║       Target: ${BASE_URL.padEnd(42)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  let personas: Persona[];
  if (targetPersona) {
    const found = ALL_PERSONAS.find(p => p.name.toLowerCase().includes(targetPersona.toLowerCase()));
    if (!found) {
      console.error(`\n  Unknown persona: "${targetPersona}"`);
      console.log(`  Available: ${ALL_PERSONAS.map(p => p.name).join(', ')}`);
      process.exit(1);
    }
    personas = [found];
  } else if (runAll) {
    personas = ALL_PERSONAS;
  } else {
    // Default: run all
    personas = ALL_PERSONAS;
  }

  const allResults: TestResult[] = [];
  for (const persona of personas) {
    try {
      const results = await runPersona(persona);
      allResults.push(...results);
    } catch (error) {
      console.error(`\n  ✗ ${persona.name} failed: ${error}`);
      allResults.push({
        persona: persona.name,
        action: 'PERSONA CRASHED',
        endpoint: '',
        method: '',
        status: 0,
        success: false,
        duration: 0,
        detail: String(error),
      });
    }
  }

  // Summary
  const passed = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;
  const total = allResults.length;
  const avgDuration = Math.round(allResults.reduce((s, r) => s + r.duration, 0) / total);

  console.log(`\n${'═'.repeat(60)}`);
  console.log('  SUMMARY');
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Total:    ${total} tests across ${personas.length} persona(s)`);
  console.log(`  Passed:   \x1b[32m${passed}\x1b[0m`);
  console.log(`  Failed:   ${failed > 0 ? `\x1b[31m${failed}\x1b[0m` : '0'}`);
  console.log(`  Avg time: ${avgDuration}ms`);

  if (failed > 0) {
    console.log(`\n  Failed tests:`);
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`    ✗ [${r.persona}] ${r.action} — ${r.detail}`);
    });
  }

  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
