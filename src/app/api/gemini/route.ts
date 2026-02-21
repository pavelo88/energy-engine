import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, isJson } = await req.json();
    // Aquí la clave SÍ está segura porque esto corre en el servidor
    const apiKey = process.env.GEMINI_API_KEY; 

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            responseMimeType: isJson ? "application/json" : "text/plain" 
          }
        })
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}