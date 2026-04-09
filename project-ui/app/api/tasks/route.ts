import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/project';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json({ tasks, total: tasks.length });
}
