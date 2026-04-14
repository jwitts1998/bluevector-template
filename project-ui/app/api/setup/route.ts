import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(process.cwd(), '..');
const SETUP_STATE_PATH = path.join(PROJECT_ROOT, 'status', 'setup-state.json');

export async function GET() {
  try {
    const data = await fs.readFile(SETUP_STATE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ items: {}, envValues: {} });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, envValues } = body;

    // Persist setup state
    await fs.mkdir(path.dirname(SETUP_STATE_PATH), { recursive: true });
    await fs.writeFile(SETUP_STATE_PATH, JSON.stringify({ items, envValues, updatedAt: new Date().toISOString() }, null, 2));

    // If envValues provided, update .env.local in project-ui
    if (envValues && Object.keys(envValues).length > 0) {
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = '';
      try {
        envContent = await fs.readFile(envPath, 'utf-8');
      } catch {
        envContent = '';
      }

      for (const [key, value] of Object.entries(envValues)) {
        if (!value) continue;
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}`;
        }
      }

      await fs.writeFile(envPath, envContent.trim() + '\n');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
