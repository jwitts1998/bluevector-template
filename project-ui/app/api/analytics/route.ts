import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(process.cwd(), '..');

async function getTaskMetrics() {
  const tasksDir = path.join(PROJECT_ROOT, 'tasks');
  const yaml = await import('js-yaml');

  let allTasks: any[] = [];
  try {
    const files = await fs.readdir(tasksDir);
    for (const file of files) {
      if (!file.endsWith('.yml') && !file.endsWith('.yaml')) continue;
      const content = await fs.readFile(path.join(tasksDir, file), 'utf-8');
      const parsed = yaml.load(content) as any;
      if (parsed?.tasks) {
        allTasks.push(...parsed.tasks);
      }
    }
  } catch { /* no tasks dir */ }

  const total = allTasks.length;
  const done = allTasks.filter((t: any) => ['done', 'completed'].includes(t.status)).length;
  const inProgress = allTasks.filter((t: any) => t.status === 'in_progress').length;
  const todo = allTasks.filter((t: any) => t.status === 'todo').length;
  const blocked = allTasks.filter((t: any) => t.status === 'blocked').length;

  // Agent role distribution
  const agentRoles: Record<string, number> = {};
  allTasks.forEach((t: any) => {
    (t.agent_roles || []).forEach((role: string) => {
      agentRoles[role] = (agentRoles[role] || 0) + 1;
    });
  });

  // Priority distribution
  const priorities: Record<string, number> = {};
  allTasks.forEach((t: any) => {
    const p = t.priority || 'unset';
    priorities[p] = (priorities[p] || 0) + 1;
  });

  return { total, done, inProgress, todo, blocked, agentRoles, priorities, completionRate: total > 0 ? Math.round((done / total) * 100) : 0 };
}

async function getGitMetrics() {
  try {
    // Recent commits
    const { stdout: logOutput } = await execAsync(
      'git log --oneline --since="30 days ago" 2>/dev/null | wc -l',
      { cwd: PROJECT_ROOT }
    );
    const recentCommits = parseInt(logOutput.trim()) || 0;

    // Contributors
    const { stdout: authorsOutput } = await execAsync(
      'git log --format="%an" --since="30 days ago" 2>/dev/null | sort -u | wc -l',
      { cwd: PROJECT_ROOT }
    );
    const contributors = parseInt(authorsOutput.trim()) || 0;

    // Files changed recently
    const { stdout: filesOutput } = await execAsync(
      'git diff --stat HEAD~5 HEAD 2>/dev/null | tail -1',
      { cwd: PROJECT_ROOT }
    );

    return { recentCommits, contributors, filesChanged: filesOutput.trim() };
  } catch {
    return { recentCommits: 0, contributors: 0, filesChanged: '' };
  }
}

async function getAgentMetrics() {
  // Count active agent configs
  const agentsDir = path.join(PROJECT_ROOT, '.claude', 'agents');
  let agentCount = 0;
  try {
    const categories = await fs.readdir(agentsDir);
    for (const cat of categories) {
      const catPath = path.join(agentsDir, cat);
      const stat = await fs.stat(catPath);
      if (stat.isDirectory()) {
        const files = await fs.readdir(catPath);
        agentCount += files.filter(f => f.endsWith('.md')).length;
      }
    }
  } catch { /* no agents */ }

  return { totalAgents: agentCount };
}

export async function GET() {
  try {
    const [taskMetrics, gitMetrics, agentMetrics] = await Promise.all([
      getTaskMetrics(),
      getGitMetrics(),
      getAgentMetrics(),
    ]);

    return NextResponse.json({
      tasks: taskMetrics,
      git: gitMetrics,
      agents: agentMetrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
