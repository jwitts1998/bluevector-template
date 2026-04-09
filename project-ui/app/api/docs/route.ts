import { NextRequest, NextResponse } from 'next/server';
import { getDocTree, getDocContent } from '@/lib/project';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (path) {
    const content = await getDocContent(path);
    if (!content) return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    return NextResponse.json({ path, content });
  }

  const tree = await getDocTree();
  return NextResponse.json({ tree });
}
