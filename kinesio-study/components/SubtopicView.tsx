'use client';
import { useState } from 'react';
import { Category, Subtopic } from '@/lib/types';
import SummaryTab from './SummaryTab';
import ChatTab from './ChatTab';
import NotesTab from './NotesTab';
import VideosTab from './VideosTab';
import FlashcardsTab from './FlashcardsTab';
import FilesTab from './FilesTab';
import { FileText, MessageCircle, StickyNote, Link2, Layers, Paperclip, Clock } from "lucide-react";

const TABS = [
  { id: 'summary', label: 'Resumen', icon: FileText },
  { id: 'chat',    label: 'Chat IA', icon: MessageCircle },
  { id: 'notes',   label: 'Notas',   icon: StickyNote },
  { id: 'videos',  label: 'Videos',  icon: Link2 },
  { id: 'cards',   label: 'Flashcards', icon: Layers },
  { id: 'files',   label: 'Archivos', icon: Paperclip },
];

interface Props {
  category: Category;
  subtopic: Subtopic;
  onUpdateSubtopic: (updated: Subtopic) => void;
}

export default function SubtopicView({ category, subtopic, onUpdateSubtopic }: Props) {
  const [tab, setTab] = useState('summary');

  const update = (partial: Partial<Subtopic>) =>
    onUpdateSubtopic({ ...subtopic, ...partial, updatedAt: new Date().toISOString() });

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-0 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{category.icon}</span>
              <span className="text-xs text-muted">{category.name}</span>
            </div>
            <h1 className="font-display text-2xl text-text font-bold">{subtopic.name}</h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
              <Clock size={11} />
              Actualizado {new Date(subtopic.updatedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className="flex gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Layers size={11} className="text-teal" />{subtopic.flashcards.length} cards</span>
            <span className="flex items-center gap-1"><StickyNote size={11} className="text-amber" />{subtopic.notes.length} notas</span>
            <span className="flex items-center gap-1"><Paperclip size={11} className="text-accent" />{subtopic.files.length} archivos</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 -mb-px">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg border-t border-x transition-all ${
                  tab === t.id
                    ? 'bg-surface border-border text-text'
                    : 'border-transparent text-muted hover:text-soft'
                }`}>
                <Icon size={12} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
        {tab === 'summary' && <SummaryTab subtopic={subtopic} onUpdate={s => update({ summary: s })} />}
        {tab === 'chat' && (
          <ChatTab
            messages={subtopic.chatHistory}
            topicContext={{ category: category.name, subtopic: subtopic.name }}
            summaryContext={subtopic.summary}
            onUpdateMessages={msgs => update({ chatHistory: msgs })}
          />
        )}
        {tab === 'notes' && <NotesTab notes={subtopic.notes} onUpdate={notes => update({ notes })} />}
        {tab === 'videos' && <VideosTab videos={subtopic.videos} onUpdate={videos => update({ videos })} />}
        {tab === 'cards' && <FlashcardsTab flashcards={subtopic.flashcards} onUpdate={flashcards => update({ flashcards })} />}
        {tab === 'files' && <FilesTab files={subtopic.files} onUpdate={files => update({ files })} />}
      </div>
    </div>
  );
}
