import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
- Responder siempre en español`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage.content);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
