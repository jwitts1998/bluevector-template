'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStream, ChatMessage } from '@/hooks/useChatStream';
import { Send, Loader2, MessageSquare, Trash2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'What agents are available in this project?',
  'Show my pending tasks',
  'Explain the project architecture',
  'What should I work on next?',
  'How do I invoke a specialist agent?',
];

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatStream();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Chat</h1>
          <p className="text-sm text-muted-foreground">AI assistant scoped to this project</p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <Card className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-1">
                  Project-scoped AI Chat
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Ask about your project&apos;s agents, tasks, docs, and architecture. The AI knows your specific project context.
                </p>
                <div className="grid gap-2 max-w-lg">
                  {SUGGESTED_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      className="text-left text-sm px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
                      onClick={() => {
                        setInput(prompt);
                        sendMessage(prompt);
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your project..."
          className="resize-none min-h-[44px] max-h-[120px]"
          rows={1}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="shrink-0 h-auto">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%] text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-current animate-pulse ml-0.5" />
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
