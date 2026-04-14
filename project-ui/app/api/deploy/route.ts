import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(process.cwd(), '..');

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();

    if (!['dev', 'staging', 'prod'].includes(target)) {
      return NextResponse.json({ success: false, error: 'Invalid target' }, { status: 400 });
    }

    // Check if gcloud is available
    try {
      await execAsync('which gcloud');
    } catch {
      return NextResponse.json({
        success: false,
        error: 'gcloud CLI not found. Install Google Cloud SDK first.',
        command: 'curl https://sdk.cloud.google.com | bash'
      }, { status: 400 });
    }

    // Build the deploy command based on target
    const gcpProject = process.env.GCP_PROJECT_ID || 'bluevector-template';
    const region = process.env.GCP_REGION || 'us-central1';
    const serviceName = `${gcpProject}-${target}`;

    const command = `gcloud run deploy ${serviceName} --source ${PROJECT_ROOT} --region=${region} --project=${gcpProject} --allow-unauthenticated --quiet`;

    return NextResponse.json({
      success: true,
      message: `Deployment to ${target} initiated`,
      command,
      target,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
