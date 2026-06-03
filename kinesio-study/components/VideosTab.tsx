'use client';
import { useState } from 'react';
import { VideoLink } from '@/lib/types';
import { generateId } from '@/lib/store';
import { Plus, Trash2, ExternalLink, Link2, Link } from "lucide-react";

interface Props {
  videos: VideoLink[];
  onUpdate: (videos: VideoLink[]) => void;
}

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function VideosTab({ videos, onUpdate }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const add = () => {
    if (!url.trim()) return;
    const v: VideoLink = { id: generateId(), title: title.trim() || url, url: url.trim(), notes: notes.trim() };
    onUpdate([v, ...videos]);
    setTitle(''); setUrl(''); setNotes('');
  };

  const remove = (id: string) => onUpdate(videos.filter(v => v.id !== id));

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Add form */}
      <div className="bg-panel border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-medium text-soft uppercase tracking-wider">Agregar recurso multimedia</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (opcional)"
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent placeholder:text-muted" />
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL del video o recurso"
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent placeholder:text-muted" />
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas sobre el video (opcional)"
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent placeholder:text-muted" />
        <button onClick={add} disabled={!url.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs disabled:opacity-30 hover:bg-blue-500 transition-colors">
          <Plus size={12} /> Agregar
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted">
            <Link2 size={28} className="mb-2 opacity-30" />
            <p className="text-sm">Sin videos agregados</p>
          </div>
        )}
        {videos.map(v => {
          const ytId = getYoutubeId(v.url);
          return (
            <div key={v.id} className="bg-panel border border-border rounded-xl overflow-hidden group animate-slide-up">
              {ytId && (
                <div className="aspect-video bg-ink">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={v.title}
                  />
                </div>
              )}
              <div className="p-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {ytId ? <Link2 size={13} className="text-red-400 flex-shrink-0" /> : <Link size={13} className="text-accent flex-shrink-0" />}
                    <span className="text-sm font-medium text-text truncate">{v.title}</span>
                  </div>
                  {v.notes && <p className="text-xs text-muted">{v.notes}</p>}
                  {!ytId && <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"><ExternalLink size={10} /> Abrir link</a>}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors"><ExternalLink size={13} /></a>
                  <button onClick={() => remove(v.id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
