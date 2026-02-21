
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Asegúrate de que la variable de entorno para la API Key esté disponible
if (!process.env.GEMINI_API_KEY) {
  throw new Error('La variable de entorno GEMINI_API_KEY no está definida.');
}

// Inicializa la IA generativa de Google con tu clave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FUNCIÓN POST PARA MANEJAR LAS PETICIONES A LA API ---
export async function POST(request: NextRequest) {
  try {
    const { prompt, isJson } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido.' }, { status: 400 });
    }

    // 1. Obtiene el modelo generativo (ACTUALIZADO a gemini-1.5-flash)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const generationConfig = {
      ...(isJson && { response_mime_type: 'application/json' }),
    };

    // 2. Genera el contenido
    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    const text = response.text();

    // 3. Devuelve la respuesta de texto de la IA (SIMPLIFICADO)
    // El frontend se encargará de parsear el JSON si es necesario.
    return NextResponse.json({ text });

  } catch (error) {
    console.error('Error en la API de Gemini:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar la solicitud.' }, { status: 500 });
  }
}
