'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

const ICONS = ['🫁','💨','❤️','🧠','💊','🩺','🔬','📊','🩻','🫀','🩹','⚡'];
const COLORS = [
  { label: 'Azul',    value: '#4f8ef7' },
  { label: 'Teal',    value: '#2dd4bf' },
  { label: 'Ámbar',   value: '#f59e0b' },
  { label: 'Rosa',    value: '#ec4899' },
  { label: 'Verde',   value: '#22c55e' },
  { label: 'Violeta', value: '#a78bfa' },
];

interface NewCategoryModalProps {
  onClose: () => void;
  onCreate: (name: string, icon: string, color: string) => void;
}
export function NewCategoryModal({ onClose, onCreate }: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🫁');
  const [color, setColor] = useState('#4f8ef7');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl text-text">Nueva Categoría</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ej: Ventilación Mecánica"
              className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-accent placeholder:text-muted" />
          </div>
          <div>
            <label className="text-xs text-muted mb-2 block">Ícono</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button key={i} onClick={() => setIcon(i)}
                  className={`text-xl p-2 rounded-lg transition-all ${icon === i ? 'bg-accent-dim ring-1 ring-accent' : 'hover:bg-panel'}`}>{i}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.value ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ background: c.value }} />
              ))}
            </div>
          </div>
          <button onClick={() => { if (name.trim()) { onCreate(name.trim(), icon, color); onClose(); } }}
            disabled={!name.trim()}
            className="w-full py-2.5 rounded-xl bg-accent text-white font-medium text-sm disabled:opacity-30 hover:bg-blue-500 transition-colors">
            Crear categoría
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewSubtopicModalProps {
  categoryName: string;
  onClose: () => void;
  onCreate: (name: string) => void;
}
export function NewSubtopicModal({ categoryName, onClose, onCreate }: NewSubtopicModalProps) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-display text-xl text-text">Nuevo Subtema</h2>
            <p className="text-xs text-muted mt-0.5">en {categoryName}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors"><X size={18} /></button>
        </div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="ej: Titulación de PEEP en SDRA"
          className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-accent placeholder:text-muted mb-4"
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) { onCreate(name.trim()); onClose(); } }}
          autoFocus />
        <button onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); } }}
          disabled={!name.trim()}
          className="w-full py-2.5 rounded-xl bg-accent text-white font-medium text-sm disabled:opacity-30 hover:bg-blue-500 transition-colors">
          Crear subtema
        </button>
      </div>
    </div>
  );
}
