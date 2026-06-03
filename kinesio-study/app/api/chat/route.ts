import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, topicContext, summaryContext } = await req.json();

  const systemPrompt = `Sos un asistente clínico especializado en kinesiología intensivista. 
El estudiante está estudiando el tema: "${topicContext.category} > ${topicContext.subtopic}".

${summaryContext ? `Resumen actual del tema:\n${summaryContext}\n\n` : ''}

Tu rol es:
- Responder preguntas clínicas con precisión y profundidad
- Usar terminología médica apropiada pero explicar conceptos complejos con claridad
- Dar ejemplos clínicos concretos cuando sea útil
- Reforzar el aprendizaje con preguntas al final de tus respuestas cuando sea pertinente
- Ser conciso pero completo
- Responder siempre en español

Si te hacen preguntas fuera del tema, podés responderlas pero reorientá hacia el tema principal.`;

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
