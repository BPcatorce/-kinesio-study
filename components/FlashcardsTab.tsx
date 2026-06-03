'use client';
import { useState } from 'react';
import { FlashCard } from '@/lib/types';
import { generateId } from '@/lib/store';
import { Plus, Trash2, ChevronLeft, ChevronRight, RotateCcw, Check, Layers } from 'lucide-react';

interface Props {
  flashcards: FlashCard[];
  onUpdate: (cards: FlashCard[]) => void;
}

export default function FlashcardsTab({ flashcards, onUpdate }: Props) {
  const [mode, setMode] = useState<'list' | 'study'>('list');
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const add = () => {
    if (!newQ.trim() || !newA.trim()) return;
    onUpdate([...flashcards, { id: generateId(), question: newQ.trim(), answer: newA.trim(), mastered: false }]);
    setNewQ(''); setNewA('');
  };

  const remove = (id: string) => onUpdate(flashcards.filter(c => c.id !== id));
  const toggleMastered = (id: string) => onUpdate(flashcards.map(c => c.id === id ? { ...c, mastered: !c.mastered } : c));

  const studyCards = flashcards.filter(c => !c.mastered);
  const card = studyCards[current];

  const next = () => { setFlipped(false); setCurrent(p => Math.min(p + 1, studyCards.length - 1)); };
  const prev = () => { setFlipped(false); setCurrent(p => Math.max(p - 1, 0)); };
  const mastered = () => { if (card) toggleMastered(card.id); setFlipped(false); setCurrent(p => Math.min(p, studyCards.length - 2)); };

  if (mode === 'study') return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setMode('list'); setFlipped(false); setCurrent(0); }}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors">
          <ChevronLeft size={14} /> Volver
        </button>
        <span className="text-xs text-muted">{current + 1} / {studyCards.length} · {flashcards.filter(c => c.mastered).length} dominadas</span>
      </div>

      {studyCards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted">
          <Check size={40} className="text-teal mb-3" />
          <p className="text-lg font-display text-text">¡Todas dominadas!</p>
          <button onClick={() => { onUpdate(flashcards.map(c => ({ ...c, mastered: false }))); setCurrent(0); }}
            className="mt-4 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-soft hover:text-text transition-colors">
            <RotateCcw size={12} /> Reiniciar
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div onClick={() => setFlipped(p => !p)}
              className="w-full max-w-lg cursor-pointer transition-all duration-300"
              style={{ perspective: '1000px' }}>
              <div style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.4s ease' }} className="relative h-52">
                {/* Front */}
                <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 bg-panel border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted mb-3 uppercase tracking-wider">Pregunta</p>
                  <p className="text-center text-text font-medium leading-relaxed">{card?.question}</p>
                  <p className="text-xs text-muted mt-4">Hacé clic para ver la respuesta</p>
                </div>
                {/* Back */}
                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 bg-teal-dim border border-teal/40 rounded-2xl p-6 flex flex-col items-center justify-center">
                  <p className="text-xs text-teal mb-3 uppercase tracking-wider">Respuesta</p>
                  <p className="text-center text-text leading-relaxed text-sm">{card?.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg border border-border disabled:opacity-30 hover:border-soft transition-colors"><ChevronLeft size={16} className="text-soft" /></button>
            <div className="flex gap-3">
              {flipped && (
                <button onClick={mastered} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-dim border border-teal/40 text-teal text-sm hover:bg-teal/20 transition-colors">
                  <Check size={14} /> Dominada
                </button>
              )}
              <button onClick={() => setFlipped(p => !p)} className="px-4 py-2 rounded-xl bg-panel border border-border text-soft text-sm hover:text-text transition-colors">
                {flipped ? 'Ver pregunta' : 'Ver respuesta'}
              </button>
            </div>
            <button onClick={next} disabled={current === studyCards.length - 1} className="p-2 rounded-lg border border-border disabled:opacity-30 hover:border-soft transition-colors"><ChevronRight size={16} className="text-soft" /></button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Study button */}
      {flashcards.length > 0 && (
        <button onClick={() => { setMode('study'); setCurrent(0); setFlipped(false); }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-dim border border-accent/40 text-accent hover:bg-accent/20 transition-colors">
          <Layers size={15} /> Estudiar con flashcards ({studyCards.length} pendientes)
        </button>
      )}

      {/* Add */}
      <div className="bg-panel border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-medium text-soft uppercase tracking-wider">Nueva flashcard</h3>
        <textarea value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Pregunta..." rows={2}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text resize-none outline-none focus:border-accent placeholder:text-muted" />
        <textarea value={newA} onChange={e => setNewA(e.target.value)} placeholder="Respuesta..." rows={3}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text resize-none outline-none focus:border-accent placeholder:text-muted" />
        <button onClick={add} disabled={!newQ.trim() || !newA.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs disabled:opacity-30 hover:bg-blue-500 transition-colors">
          <Plus size={12} /> Agregar
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {flashcards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted">
            <Layers size={28} className="mb-2 opacity-30" />
            <p className="text-sm">Sin flashcards todavía</p>
          </div>
        )}
        {flashcards.map(card => (
          <div key={card.id} className={`bg-panel border rounded-xl p-3 group animate-slide-up ${card.mastered ? 'border-teal/30 opacity-60' : 'border-border'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted mb-0.5">P: <span className="text-soft">{card.question}</span></p>
                <p className="text-xs text-muted">R: <span className="text-text">{card.answer}</span></p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => toggleMastered(card.id)} title={card.mastered ? 'Marcar pendiente' : 'Marcar como dominada'}
                  className={`p-1 rounded transition-colors ${card.mastered ? 'text-teal hover:text-muted' : 'text-muted hover:text-teal'}`}>
                  <Check size={12} />
                </button>
                <button onClick={() => remove(card.id)} className="p-1 rounded text-muted hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
