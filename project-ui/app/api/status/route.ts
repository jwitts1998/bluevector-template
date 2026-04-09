import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GET /api/status
 *
 * Returns the project's brain data for Command Center aggregation.
 * Command Center polls this to understand portfolio health.
 */
export async function GET() {
  try {
    const statusPath = path.join(process.cwd(), '..', '..', 'status', 'status.json');

    if (fs.existsSync(statusPath)) {
      const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
      return NextResponse.json({
        success: true,
        data: statusData,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback if status.json doesn't exist yet
    return NextResponse.json({
      success: true,
      data: {
        repoId: process.env.REPO_ID || 'unknown',
        name: process.env.REPO_NAME || 'Unknown Project',
        ok: true,
        lastUpdatedAt: new Date().toISOString(),
        git: {
          head: 'unknown',
          branch: 'main',
        },
        signals: {
          hasStatusFile: fs.existsSync(statusPath),
          hasPackageJson: fs.existsSync(path.join(process.cwd(), '..', '..', 'package.json')),
          hasSrc: fs.existsSync(path.join(process.cwd(), '..', '..', 'src')),
          hasAgentConfigs: fs.existsSync(path.join(process.cwd(), '..', '..', '.claude')),
          hasTasks: fs.existsSync(path.join(process.cwd(), '..', '..', 'tasks')),
          hasPDB: false,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error reading status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
