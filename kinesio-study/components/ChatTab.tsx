'use client';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { Send, Bot, User, Trash2, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  messages: ChatMessage[];
  topicContext: { category: string; subtopic: string };
  summaryContext: string;
  onUpdateMessages: (msgs: ChatMessage[]) => void;
}

export default function ChatTab({ messages, topicContext, summaryContext, onUpdateMessages }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    onUpdateMessages(newMessages);
    setLoading(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          topicContext,
          summaryContext,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        full += chunk;
        setStreamingText(full);
      }

      onUpdateMessages([...newMessages, { role: 'assistant', content: full }]);
      setStreamingText('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => { if (confirm('¿Limpiar historial del chat?')) onUpdateMessages([]); };

  const allMessages = loading && streamingText
    ? [...messages, { role: 'assistant' as const, content: streamingText }]
    : messages;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot size={15} className="text-accent" />
          <span className="text-sm font-medium text-soft">IA Tutora — {topicContext.subtopic}</span>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-muted hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Bot size={32} className="text-muted mb-3 opacity-40" />
            <p className="text-sm text-muted mb-1">Preguntame sobre <strong className="text-soft">{topicContext.subtopic}</strong></p>
            <p className="text-xs text-muted opacity-60">Tengo en cuenta tu resumen y el contexto del tema</p>
          </div>
        )}
        {allMessages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-accent-dim' : 'bg-teal-dim'
            }`}>
              {msg.role === 'user' ? <User size={13} className="text-accent" /> : <Bot size={13} className="text-teal" />}
            </div>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-accent-dim text-text'
                : 'bg-panel border border-border text-soft prose-study'
            }`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              ) : msg.content}
              {loading && i === allMessages.length - 1 && msg.role === 'assistant' && (
                <span className="inline-block w-2 h-4 bg-teal ml-0.5 animate-pulse-soft rounded-sm" />
              )}
            </div>
          </div>
        ))}
        {loading && !streamingText && (
          <div className="flex items-center gap-2 text-muted text-xs">
            <Loader size={12} className="animate-spin" /> Pensando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Preguntá algo sobre el tema... (Enter para enviar)"
          rows={2}
          className="flex-1 bg-panel border border-border rounded-xl px-4 py-3 text-sm text-text resize-none focus:border-accent outline-none placeholder:text-muted leading-relaxed"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}
