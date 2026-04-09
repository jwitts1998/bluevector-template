'use client';

import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function useDocumentBuilder(artifactType: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [document, setDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };

    const assistantId = `assistant-${Date.now()}`;
    const placeholder: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, placeholder]);
    setIsLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history,
          artifactType,
          document,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }

      // Extract document from the response
      const docMatch = accumulated.match(/---DOCUMENT_START---([\s\S]*?)---DOCUMENT_END---/);
      if (docMatch) {
        setDocument(docMatch[1].trim());

        // Store only the conversational part in the message
        const conversational = accumulated
          .replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/, '')
          .trim();

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: conversational || 'Document updated.', isStreaming: false }
              : m
          )
        );
      } else {
        // No document markers — just a conversational response
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const errorMessage = err instanceof Error ? err.message : 'Failed';
      setError(errorMessage);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  }, [messages, document, artifactType]);

  const saveDocument = useCallback(async (filename: string) => {
    if (!document) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/design', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifactType, document, filename }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedPath(data.path);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  }, [document, artifactType]);

  const clearAll = useCallback(() => {
    setMessages([]);
    setDocument('');
    setError(null);
    setSavedPath(null);
  }, []);

  return {
    messages,
    document,
    isLoading,
    error,
    isSaving,
    savedPath,
    sendMessage,
    saveDocument,
    clearAll,
    setDocument,
  };
}
