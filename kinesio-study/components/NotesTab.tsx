'use client';
import { useState } from 'react';
import { QuickNote } from '@/lib/types';
import { generateId } from '@/lib/store';
import { Plus, Trash2, StickyNote } from 'lucide-react';

const COLORS = ['blue', 'teal', 'amber', 'red'] as const;
type NoteColor = typeof COLORS[number];

const COLOR_STYLES: Record<NoteColor, { bg: string; border: string; text: string }> = {
  blue:  { bg: 'bg-accent-dim',  border: 'border-accent',       text: 'text-accent' },
  teal:  { bg: 'bg-teal-dim',    border: 'border-teal',         text: 'text-teal' },
  amber: { bg: 'bg-amber-dim',   border: 'border-amber',        text: 'text-amber' },
  red:   { bg: 'bg-red-900/30',  border: 'border-red-500/50',   text: 'text-red-400' },
};

interface Props {
  notes: QuickNote[];
  onUpdate: (notes: QuickNote[]) => void;
}

export default function NotesTab({ notes, onUpdate }: Props) {
  const [newText, setNewText] = useState('');
  const [color, setColor] = useState<NoteColor>('blue');

  const add = () => {
    if (!newText.trim()) return;
    const note: QuickNote = { id: generateId(), content: newText.trim(), createdAt: new Date().toISOString(), color };
    onUpdate([note, ...notes]);
    setNewText('');
  };

  const remove = (id: string) => onUpdate(notes.filter(n => n.id !== id));
  const updateNote = (id: string, content: string) => onUpdate(notes.map(n => n.id === id ? { ...n, content } : n));

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Add note */}
      <div className="bg-panel border border-border rounded-xl p-4">
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Nueva nota rápida..."
          rows={3}
          className="w-full bg-transparent text-sm text-text resize-none outline-none placeholder:text-muted mb-3"
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) add(); }}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${COLOR_STYLES[c].border} ${color === c ? 'scale-125' : 'opacity-40 hover:opacity-70'}`}
                style={{ background: c === 'blue' ? '#1e3a6e' : c === 'teal' ? '#0f3d38' : c === 'amber' ? '#3d2a00' : '#3d0f0f' }}
              />
            ))}
          </div>
          <button onClick={add} disabled={!newText.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs disabled:opacity-30 hover:bg-blue-500 transition-colors">
            <Plus size={12} /> Agregar
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted">
            <StickyNote size={28} className="mb-2 opacity-30" />
            <p className="text-sm">Sin notas todavía</p>
          </div>
        )}
        {notes.map(note => {
          const s = COLOR_STYLES[note.color];
          return (
            <div key={note.id} className={`relative rounded-xl p-4 border ${s.bg} ${s.border} animate-slide-up group`}>
              <textarea
                value={note.content}
                onChange={e => updateNote(note.id, e.target.value)}
                className="w-full bg-transparent text-sm text-text resize-none outline-none leading-relaxed"
                rows={Math.max(2, note.content.split('\n').length)}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted">{new Date(note.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <button onClick={() => remove(note.id)} className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
