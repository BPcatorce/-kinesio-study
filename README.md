# KineStudy 🫁

App de estudio personalizada para **Kinesiología Intensivista**.

## Features
- 📁 Categorías y subtemas de estudio
- 📝 Resúmenes en Markdown editables
- 💬 Chat con IA contextualizado por tema
- 🗒️ Notas rápidas con colores
- 🎥 Links a videos (con embed de YouTube)
- 📎 Adjuntos (PDFs, imágenes)
- 🃏 Flashcards con modo estudio

## Setup

1. Clonar repositorio
2. `npm install`
3. Crear `.env.local`:
   ```
   ANTHROPIC_API_KEY=tu_clave_aqui
   ```
4. `npm run dev`

## Deploy en Vercel

1. Push a GitHub
2. Importar repo en vercel.com
3. Agregar `ANTHROPIC_API_KEY` en Environment Variables
4. Deploy ✅
