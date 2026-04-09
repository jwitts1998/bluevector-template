import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, extname, basename } from 'path';
import matter from 'gray-matter';

// Project root is the parent of project-ui/
const PROJECT_ROOT = process.env.PROJECT_ROOT || join(process.cwd(), '..');

export function getProjectRoot(): string {
  return PROJECT_ROOT;
}

// ─── Project Config ────────────────────────────────────────────────────────

export interface ProjectConfig {
  name: string;
  stack: string;
  description: string;
  agentCount: number;
  taskCount: number;
  docsCount: number;
}

export async function getProjectConfig(): Promise<ProjectConfig> {
  const root = getProjectRoot();
  let name = basename(root);
  let stack = '';
  let description = '';

  // Try to extract from CLAUDE.md
  try {
    const claudeMd = await readFile(join(root, 'CLAUDE.md'), 'utf-8');
    const nameMatch = claudeMd.match(/Project[:\s]+(.+)/i);
    if (nameMatch) name = nameMatch[1].trim();

    const stackMatch = claudeMd.match(/(?:Stack|Framework)[:\s]+(.+)/i);
    if (stackMatch) stack = stackMatch[1].trim();

    const descMatch = claudeMd.match(/(?:Description|Overview)[:\s]+(.+)/i);
    if (descMatch) description = descMatch[1].trim();
  } catch {}

  // Fallback: detect from pubspec or package.json
  if (!stack) {
    try {
      await stat(join(root, 'pubspec.yaml'));
      stack = 'Flutter / Dart';
    } catch {}
  }
  if (!stack) {
    try {
      const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf-8'));
      if (pkg.dependencies?.next) stack = 'Next.js';
      else if (pkg.dependencies?.react) stack = 'React';
      else if (pkg.dependencies?.express) stack = 'Express';
      name = pkg.name || name;
      description = pkg.description || description;
    } catch {}
  }

  const agents = await getAgents();
  const tasks = await getTasks();
  const docs = await getDocTree();

  return {
    name,
    stack,
    description,
    agentCount: agents.length,
    taskCount: tasks.length,
    docsCount: countDocs(docs),
  };
}

// ─── Agents ────────────────────────────────────────────────────────────────

export interface AgentInfo {
  slug: string;
  name: string;
  description: string;
  category: string;
  filePath: string;
}

export async function getAgents(): Promise<AgentInfo[]> {
  const root = getProjectRoot();
  const agents: AgentInfo[] = [];
  const seen = new Set<string>();

  const categories = ['generic', 'specialists', 'domains', 'ideation', 'ingestion', 'system'];

  // Scan both .claude/agents/ (active) and templates/subagents/ (full catalog)
  const agentDirs = [
    join(root, '.claude', 'agents'),
    join(root, 'templates', 'subagents'),
  ];

  for (const agentsDir of agentDirs) {
    for (const category of categories) {
      const categoryDir = join(agentsDir, category);
      try {
        const files = await readdir(categoryDir);
        for (const file of files) {
          if (!file.endsWith('.md') || file === 'README.md') continue;
          const slug = file.replace('.md', '');
          if (seen.has(slug)) continue; // deduplicate
          seen.add(slug);
          try {
            const content = await readFile(join(categoryDir, file), 'utf-8');
            const { data } = matter(content);
            agents.push({
              slug,
              name: (data.name as string) || slug,
              description: (data.description as string) || '',
              category,
              filePath: relative(root, join(categoryDir, file)),
            });
          } catch {}
        }
      } catch {}
    }
  }

  return agents;
}

export async function getAgentContent(slug: string): Promise<{ frontmatter: Record<string, unknown>; content: string } | null> {
  const root = getProjectRoot();
  const categories = ['generic', 'specialists', 'domains', 'ideation', 'ingestion', 'system'];

  // Search both active agents and template subagents
  const agentDirs = [
    join(root, '.claude', 'agents'),
    join(root, 'templates', 'subagents'),
  ];

  for (const agentsDir of agentDirs) {
    for (const category of categories) {
      const filePath = join(agentsDir, category, `${slug}.md`);
      try {
        const raw = await readFile(filePath, 'utf-8');
        const { data, content } = matter(raw);
        return { frontmatter: data, content };
      } catch {}
    }
  }

  return null;
}

// ─── Tasks ─────────────────────────────────────────────────────────────────

export interface TaskInfo {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  agent_roles: string[];
  acceptance_criteria: string[];
  file: string;
}

export async function getTasks(): Promise<TaskInfo[]> {
  const root = getProjectRoot();
  const tasksDir = join(root, 'tasks');
  const tasks: TaskInfo[] = [];

  try {
    const files = await readdir(tasksDir);
    for (const file of files) {
      if (!file.endsWith('.yml') && !file.endsWith('.yaml')) continue;
      try {
        const content = await readFile(join(tasksDir, file), 'utf-8');
        // Dynamic import js-yaml
        const yaml = await import('js-yaml');
        const parsed = yaml.load(content) as any;

        // Handle both array format and object with tasks array
        const taskList = Array.isArray(parsed) ? parsed : parsed?.tasks || [];
        for (const task of taskList) {
          if (task?.id && task?.title) {
            tasks.push({
              id: task.id,
              title: task.title,
              description: task.description || '',
              status: task.status || 'todo',
              priority: task.priority || 'medium',
              agent_roles: task.agent_roles || [],
              acceptance_criteria: task.acceptance_criteria || [],
              file,
            });
          }
        }
      } catch {}
    }
  } catch {}

  return tasks;
}

// ─── Docs ──────────────────────────────────────────────────────────────────

export interface DocNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: DocNode[];
}

export async function getDocTree(): Promise<DocNode[]> {
  const root = getProjectRoot();
  const docsDir = join(root, 'docs');
  return buildDocTree(docsDir, root);
}

async function buildDocTree(dir: string, root: string): Promise<DocNode[]> {
  const nodes: DocNode[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relPath = relative(root, fullPath);

      if (entry.isDirectory()) {
        const children = await buildDocTree(fullPath, root);
        if (children.length > 0) {
          nodes.push({ name: entry.name, path: relPath, type: 'directory', children });
        }
      } else if (entry.name.endsWith('.md')) {
        nodes.push({ name: entry.name, path: relPath, type: 'file' });
      }
    }
  } catch {}

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function countDocs(nodes: DocNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'file') count++;
    if (node.children) count += countDocs(node.children);
  }
  return count;
}

export async function getDocContent(docPath: string): Promise<string | null> {
  const root = getProjectRoot();
  const fullPath = join(root, docPath);

  // Security: ensure path is within project root
  if (!fullPath.startsWith(root)) return null;
  if (extname(fullPath) !== '.md') return null;

  try {
    return await readFile(fullPath, 'utf-8');
  } catch {
    return null;
  }
}
