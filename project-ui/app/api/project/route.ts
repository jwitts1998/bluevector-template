import { NextResponse } from 'next/server';
import { getProjectConfig } from '@/lib/project';

export async function GET() {
  try {
    const config = await getProjectConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ name: 'Unknown', stack: '', description: '', agentCount: 0, taskCount: 0, docsCount: 0 });
  }
}
