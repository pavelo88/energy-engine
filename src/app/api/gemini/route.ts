import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("ERROR: No se encontró GEMINI_API_KEY en variables de entorno");
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    // Usamos el modelo más estable actualmente
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Google API:", data);
      return NextResponse.json({ error: data.error?.message || "Error en Google AI" }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error fatal en /api/gemini:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}