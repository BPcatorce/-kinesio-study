'use client';
import { useState } from 'react';
import { Subtopic } from '@/lib/types';
import { Edit3, Save, X, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  subtopic: Subtopic;
  onUpdate: (summary: string) => void;
}

export default function SummaryTab({ subtopic, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(subtopic.summary);

  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(subtopic.summary); setEditing(false); };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-soft">
          <FileText size={15} />
          <span className="text-sm font-medium">Resumen del tema</span>
        </div>
        {!editing ? (
          <button onClick={() => { setDraft(subtopic.summary); setEditing(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border text-xs text-soft hover:text-accent hover:border-accent transition-colors">
            <Edit3 size={12} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border text-xs text-soft hover:text-red-400 transition-colors">
              <X size={12} /> Cancelar
            </button>
            <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-blue-500 transition-colors">
              <Save size={12} /> Guardar
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-xs text-muted">Soporta Markdown: **negrita**, ## títulos, - listas, `código`, &gt; citas</p>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="flex-1 bg-panel border border-border rounded-xl p-4 text-sm text-text font-mono resize-none focus:border-accent outline-none leading-relaxed"
            placeholder="Escribí tu resumen en Markdown..."
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {subtopic.summary ? (
            <div className="prose-study animate-fade-in">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{subtopic.summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted">
              <FileText size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Sin resumen todavía</p>
              <button onClick={() => setEditing(true)} className="mt-3 text-xs text-accent hover:underline">Crear resumen</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
