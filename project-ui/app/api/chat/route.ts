import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { NextRequest } from 'next/server';
import { getProjectConfig, getAgents, getTasks } from '@/lib/project';

export async function POST(request: NextRequest) {
  const { message, history = [] } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
  }

  // Check if CC is available for proxy
  const brainRoot = process.env.BRAIN_ROOT;
  const ccUrl = process.env.COMMAND_CENTER_URL || 'http://localhost:3000';

  if (brainRoot) {
    try {
      const ccResponse = await fetch(`${ccUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (ccResponse.ok) {
        return new Response(ccResponse.body, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    } catch {
      // CC not reachable, fall through to direct mode
    }
  }

  // Direct mode: use Anthropic API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is required. Set it in project-ui/.env.local' }),
      { status: 500 }
    );
  }

  // Build project-scoped system prompt
  const [config, agents, tasks] = await Promise.all([
    getProjectConfig().catch(() => null),
    getAgents().catch(() => []),
    getTasks().catch(() => []),
  ]);

  const agentList = agents.map(a => `- @${a.slug} (${a.category}): ${a.description}`).join('\n');
  const taskSummary = tasks.length > 0
    ? `Tasks: ${tasks.length} total, ${tasks.filter(t => t.status === 'todo').length} todo, ${tasks.filter(t => t.status === 'in_progress').length} in progress, ${tasks.filter(t => t.status === 'done' || t.status === 'completed').length} done`
    : 'No tasks found in tasks/*.yml';

  const systemPrompt = `You are a project-scoped AI assistant for ${config?.name || 'this project'}.

## Project Context
- **Name**: ${config?.name || 'Unknown'}
- **Stack**: ${config?.stack || 'Unknown'}
- **Description**: ${config?.description || 'No description'}
- **Agents**: ${agents.length} installed
- **Docs**: ${config?.docsCount || 0} documentation files

## Available Agents
${agentList || 'No agents installed'}

## Task Status
${taskSummary}

## Your Role
Help the developer with this specific project. You know about the project's agents, tasks, and documentation. Answer questions about the project, suggest which agents to use for tasks, and help navigate the codebase.

Keep responses concise and project-focused.`;

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
