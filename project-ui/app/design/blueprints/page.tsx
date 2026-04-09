'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PenTool, Bot, Plus, FileText, ArrowRight } from 'lucide-react';

interface DocNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: DocNode[];
}

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(data => {
        const paths: string[] = [];
        const findPDBs = (nodes: DocNode[]) => {
          for (const node of nodes) {
            if (node.type === 'file' && (node.path.includes('product_design') || node.path.toLowerCase().includes('pdb'))) {
              paths.push(node.path);
            }
            if (node.children) findPDBs(node.children);
          }
        };
        findPDBs(data.tree || []);
        setBlueprints(paths);
      })
      .catch(() => {});
  }, []);

  const loadBlueprint = async (path: string) => {
    setSelectedPath(path);
    try {
      const res = await fetch(`/api/docs?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setSelectedContent(data.content || 'No content');
    } catch {
      setSelectedContent('Failed to load');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Design Blueprints</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive product specs: user personas, journey maps, feature matrix, success metrics
          </p>
        </div>
        <Button className="gap-1 bg-sky-600 hover:bg-sky-700">
          <Plus className="h-4 w-4" /> New Blueprint
        </Button>
      </div>

      {/* How to create */}
      <Card className="border-sky-200 bg-sky-50/30">
        <CardContent className="py-4">
          <p className="font-semibold text-sm mb-2">Creating a Product Design Blueprint</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs font-mono shrink-0">
                <Bot className="h-3 w-3 mr-1" />@idea-to-pdb
              </Badge>
              <p className="text-xs text-muted-foreground">Start from a high-level idea or concept</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs font-mono shrink-0">
                <Bot className="h-3 w-3 mr-1" />@context-to-pdb
              </Badge>
              <p className="text-xs text-muted-foreground">Transform stakeholder interview notes into a PDB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blueprint List or Empty State */}
      {blueprints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <PenTool className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No Product Design Blueprints yet</p>
            <p className="text-sm mt-1">
              Use <code className="text-xs bg-muted px-1 py-0.5 rounded">@idea-to-pdb</code> in the AI Chat to generate your first PDB
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {blueprints.map(path => (
            <Card
              key={path}
              className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedPath === path ? 'ring-2 ring-primary' : ''}`}
              onClick={() => loadBlueprint(path)}
            >
              <CardContent className="flex items-center gap-3 py-4">
                <FileText className="h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-medium text-sm">{path.split('/').pop()}</p>
                  <p className="text-xs text-muted-foreground">{path}</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blueprint Content Viewer */}
      {selectedPath && (
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-mono mb-3">{selectedPath}</p>
            <ScrollArea className="max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{selectedContent}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
