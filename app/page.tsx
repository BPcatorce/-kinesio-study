'use client';
import { useState, useEffect } from 'react';
import { StudyStore, Category, Subtopic } from '@/lib/types';
import { loadStore, saveStore, generateId } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import SubtopicView from '@/components/SubtopicView';
import { NewCategoryModal, NewSubtopicModal } from '@/components/Modals';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  const [store, setStore] = useState<StudyStore | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newSubCatId, setNewSubCatId] = useState<string | null>(null);

  useEffect(() => {
    const s = loadStore();
    setStore(s);
    if (s.categories[0]?.subtopics[0]) {
      setSelectedCatId(s.categories[0].id);
      setSelectedSubId(s.categories[0].subtopics[0].id);
    }
  }, []);

  const persist = (updated: StudyStore) => { setStore(updated); saveStore(updated); };

  const updateSubtopic = (catId: string, updated: Subtopic) => {
    if (!store) return;
    persist({
      ...store,
      categories: store.categories.map(c =>
        c.id === catId ? { ...c, subtopics: c.subtopics.map(s => s.id === updated.id ? updated : s) } : c
      ),
    });
  };

  const createCategory = (name: string, icon: string, color: string) => {
    if (!store) return;
    const cat: Category = { id: generateId(), name, icon, color, subtopics: [], createdAt: new Date().toISOString() };
    persist({ ...store, categories: [...store.categories, cat] });
  };

  const createSubtopic = (catId: string, name: string) => {
    if (!store) return;
    const sub: Subtopic = {
      id: generateId(), name, summary: '', videos: [], files: [], notes: [],
      flashcards: [], chatHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    const updated = {
      ...store,
      categories: store.categories.map(c => c.id === catId ? { ...c, subtopics: [...c.subtopics, sub] } : c),
    };
    persist(updated);
    setSelectedCatId(catId);
    setSelectedSubId(sub.id);
  };

  if (!store) return (
    <div className="h-screen flex items-center justify-center bg-ink">
      <div className="text-muted text-sm animate-pulse-soft">Cargando...</div>
    </div>
  );

  const selCat = store.categories.find(c => c.id === selectedCatId);
  const selSub = selCat?.subtopics.find(s => s.id === selectedSubId);

  return (
    <div className="flex h-screen bg-ink overflow-hidden">
      <Sidebar
        categories={store.categories}
        selectedCategoryId={selectedCatId}
        selectedSubtopicId={selectedSubId}
        onSelectSubtopic={(catId, subId) => { setSelectedCatId(catId); setSelectedSubId(subId); }}
        onNewCategory={() => setShowNewCat(true)}
        onNewSubtopic={(catId) => setNewSubCatId(catId)}
      />

      <main className="flex-1 overflow-hidden">
        {selCat && selSub ? (
          <SubtopicView
            key={selSub.id}
            category={selCat}
            subtopic={selSub}
            onUpdateSubtopic={updated => updateSubtopic(selCat.id, updated)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center mb-6">
              <BookOpen size={28} className="text-accent" />
            </div>
            <h2 className="font-display text-3xl text-text mb-3">KineStudy</h2>
            <p className="text-soft max-w-sm mb-6">Tu espacio de estudio para Kinesiología Intensivista. Seleccioná un subtema del panel izquierdo para comenzar.</p>
            <div className="flex gap-2 text-xs text-muted">
              <ArrowRight size={13} className="flex-shrink-0 mt-0.5" />
              <span>Expandí una categoría para ver los subtemas disponibles</span>
            </div>
          </div>
        )}
      </main>

      {showNewCat && <NewCategoryModal onClose={() => setShowNewCat(false)} onCreate={createCategory} />}
      {newSubCatId && (
        <NewSubtopicModal
          categoryName={store.categories.find(c => c.id === newSubCatId)?.name || ''}
          onClose={() => setNewSubCatId(null)}
          onCreate={(name) => createSubtopic(newSubCatId, name)}
        />
      )}
    </div>
  );
}
