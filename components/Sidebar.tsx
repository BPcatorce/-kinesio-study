'use client';
import { useState } from 'react';
import { Category, Subtopic } from '@/lib/types';
import { ChevronRight, Plus, BookOpen, Search, X } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubtopicId: string | null;
  onSelectSubtopic: (catId: string, subId: string) => void;
  onNewCategory: () => void;
  onNewSubtopic: (catId: string) => void;
}

export default function Sidebar({ categories, selectedCategoryId, selectedSubtopicId, onSelectSubtopic, onNewCategory, onNewSubtopic }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const filtered = search.trim()
    ? categories.map(c => ({
        ...c,
        subtopics: c.subtopics.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      })).filter(c => c.subtopics.length > 0)
    : categories;

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-accent" />
          <span className="font-display text-lg font-bold text-text">KineStudy</span>
        </div>
        <p className="text-xs text-muted">Kinesiología Intensivista</p>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-border">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tema..."
            className="w-full bg-panel text-text text-xs pl-7 pr-7 py-2 rounded-lg border border-border focus:border-accent outline-none placeholder:text-muted"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-2.5 text-muted hover:text-text"><X size={12} /></button>}
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-2">
        {filtered.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-panel text-sm text-soft hover:text-text transition-colors group"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="flex-1 text-left font-medium truncate">{cat.name}</span>
              <span className="text-xs text-muted opacity-0 group-hover:opacity-100">{cat.subtopics.length}</span>
              <ChevronRight size={12} className={`text-muted transition-transform ${expanded[cat.id] ? 'rotate-90' : ''}`} />
            </button>

            {expanded[cat.id] && (
              <div className="ml-3 border-l border-border pl-2 mb-1">
                {cat.subtopics.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubtopic(cat.id, sub.id)}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-md mb-0.5 transition-all ${
                      selectedSubtopicId === sub.id
                        ? 'bg-accent-dim text-accent font-medium'
                        : 'text-muted hover:text-text hover:bg-panel'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
                <button
                  onClick={() => onNewSubtopic(cat.id)}
                  className="w-full flex items-center gap-1 px-2 py-1.5 text-xs text-muted hover:text-teal transition-colors"
                >
                  <Plus size={10} /> Nuevo subtema
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* New Category */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onNewCategory}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border text-xs text-muted hover:text-accent hover:border-accent transition-colors"
        >
          <Plus size={12} /> Nueva categoría
        </button>
      </div>
    </aside>
  );
}
