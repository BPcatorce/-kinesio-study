import { Category, StudyStore } from './types';

const STORE_KEY = 'kinesio_study_store_v1';

const DEFAULT_STORE: StudyStore = {
  categories: [
    {
      id: 'cat_ventilacion',
      name: 'Ventilación Mecánica',
      icon: '🫁',
      color: '#4f8ef7',
      createdAt: new Date().toISOString(),
      subtopics: [
        {
          id: 'sub_peep_sdra',
          name: 'Titulación de PEEP en SDRA',
          summary: '## Titulación de PEEP en SDRA\n\nEl PEEP (Presión Positiva al Final de la Espiración) es fundamental en el manejo del SDRA para mantener abiertos los alvéolos y mejorar la oxigenación.\n\n### Estrategias principales\n\n- **Tabla ARDS Network**: Ajuste basado en FiO₂/PEEP\n- **Trial de PEEP decremental**: Comenzar en 20-25 cmH₂O y bajar buscando mejor compliance\n- **Maniobras de reclutamiento**: Previo a titulación\n\n### Objetivos\n\n- SpO₂ > 88-90% con FiO₂ < 0.6\n- Driving pressure < 15 cmH₂O\n- Presión meseta < 30 cmH₂O',
          videos: [],
          files: [],
          notes: [],
          flashcards: [
            { id: 'fc1', question: '¿Cuál es el objetivo de SpO₂ mínimo en SDRA severo?', answer: 'SpO₂ ≥ 88% con FiO₂ lo más baja posible. Se acepta hipoxemia permisiva (SpO₂ 88-92%) para evitar toxicidad por oxígeno y VILI.', mastered: false },
            { id: 'fc2', question: '¿Qué es el driving pressure y cuál es el valor límite de seguridad?', answer: 'Driving pressure = Presión meseta - PEEP. Refleja la tensión sobre el pulmón. El valor límite es < 15 cmH₂O. Valores mayores se asocian a mayor mortalidad.', mastered: false },
          ],
          chatHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
    },
    {
      id: 'cat_weaning',
      name: 'Weaning y Destete',
      icon: '💨',
      color: '#2dd4bf',
      createdAt: new Date().toISOString(),
      subtopics: [],
    },
    {
      id: 'cat_hemodinamica',
      name: 'Hemodinámica',
      icon: '❤️',
      color: '#f59e0b',
      createdAt: new Date().toISOString(),
      subtopics: [],
    },
  ],
};

export function loadStore(): StudyStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      saveStore(DEFAULT_STORE);
      return DEFAULT_STORE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: StudyStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
