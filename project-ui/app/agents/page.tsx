'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Bot } from 'lucide-react';

interface Agent {
  slug: string;
  name: string;
  description: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  generic: 'Generic',
  specialists: 'Specialists',
  domains: 'Domain Agents',
  ideation: 'Ideation',
  ingestion: 'Ingestion',
  system: 'System',
};

const CATEGORY_ORDER = ['generic', 'specialists', 'domains', 'ideation', 'ingestion', 'system'];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Agent[]>>({});
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentContent, setAgentContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents || []);
        setGrouped(data.grouped || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAgentClick = async (slug: string) => {
    setSelectedAgent(slug);
    try {
      const res = await fetch(`/api/agents?slug=${slug}`);
      const data = await res.json();
      setAgentContent(data.content || 'No content available');
    } catch {
      setAgentContent('Failed to load agent content');
    }
  };

  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([category, categoryAgents]) => [
      category,
      categoryAgents.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
      ),
    ]).filter(([, categoryAgents]) => (categoryAgents as Agent[]).length > 0)
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading agents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">{agents.length} agents installed across {Object.keys(grouped).length} categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Agent Grid by Category */}
      {CATEGORY_ORDER.filter(cat => filteredGrouped[cat]?.length > 0).map(category => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            {CATEGORY_LABELS[category] || category}
            <Badge variant="secondary">{filteredGrouped[category].length}</Badge>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrouped[category].map((agent: Agent) => (
              <Card
                key={agent.slug}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleAgentClick(agent.slug)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">@{agent.name || agent.slug}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {agent.description || 'No description'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Agent Detail Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>@{selectedAgent}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-sm whitespace-pre-wrap font-mono p-4 bg-muted rounded-lg">
              {agentContent}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
