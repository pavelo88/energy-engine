
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Asegúrate de que la variable de entorno para la API Key esté disponible
if (!process.env.GEMINI_API_KEY) {
  throw new Error('La variable de entorno GEMINI_API_KEY no está definida.');
}

// Inicializa la IA generativa de Google con tu clave de API desde las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FUNCIÓN POST PARA MANEJAR LAS PETICIONES A LA API ---
export async function POST(request: NextRequest) {
  try {
    // 1. Extrae el "prompt" y la configuración del cuerpo de la petición
    const { prompt, isJson } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido.' }, { status: 400 });
    }

    // 2. Obtiene el modelo generativo
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 3. Prepara la configuración para la generación de contenido
    const generationConfig = {
      // Si isJson es true, configura la respuesta para que sea JSON
      ...(isJson && { response_mime_type: 'application/json' }),
    };

    // 4. Genera el contenido usando el prompt y la configuración
    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    const text = response.text();

    // 5. Devuelve la respuesta generada por la IA
    // Se parsea a JSON si se solicitó, si no, se devuelve como texto plano.
    const responseData = isJson ? JSON.parse(text) : { text };
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error en la API de Gemini:', error);
    // Devuelve un error genérico al cliente para no exponer detalles internos
    return NextResponse.json({ error: 'Ocurrió un error al procesar la solicitud.' }, { status: 500 });
  }
}
