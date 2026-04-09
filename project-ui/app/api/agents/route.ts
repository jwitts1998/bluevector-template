import { NextRequest, NextResponse } from 'next/server';
import { getAgents, getAgentContent } from '@/lib/project';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const agent = await getAgentContent(slug);
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    return NextResponse.json(agent);
  }

  const agents = await getAgents();

  // Group by category
  const grouped: Record<string, typeof agents> = {};
  for (const agent of agents) {
    if (!grouped[agent.category]) grouped[agent.category] = [];
    grouped[agent.category].push(agent);
  }

  return NextResponse.json({ agents, grouped, total: agents.length });
}
