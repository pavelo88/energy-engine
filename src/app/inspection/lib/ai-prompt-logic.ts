import { NextResponse } from 'next/server';
import { getSystemPrompt } from '@/app/inspection/lib/ai-prompt-logic';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `${getSystemPrompt()}\n\nAnaliza este dictado: "${transcript}"` }] 
          }],
          generationConfig: { 
            temperature: 0.1, 
            responseMimeType: "application/json" 
          }
        })
      }
    );

    const data = await response.json();
    const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando dictado' }, { status: 500 });
  }
}