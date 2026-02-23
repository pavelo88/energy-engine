'use server';
/**
 * @fileOverview A Genkit flow to process technical dictation.
 *
 * - processDictation - A function that processes technical dictation using AI.
 * - ProcessDictationInput - The input type for the processDictation function.
 * - ProcessDictationOutput - The return type for the processDictation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessDictationInputSchema = z.object({
  dictation: z.string().describe('El dictado técnico del inspector.'),
});
export type ProcessDictationInput = z.infer<typeof ProcessDictationInputSchema>;

const ProcessDictationOutputSchema = z.object({
  identidad: z.object({
    cliente: z.string().optional(),
    instalacion: z.string().optional(),
    n_grupo: z.string().optional(),
    potencia: z.string().optional(),
    marca: z.string().optional(),
    modelo: z.string().optional(),
    sn: z.string().optional(),
    recibe: z.string().optional(),
  }),
  all_ok: z.boolean(),
  checklist_updates: z.record(z.string()),
  mediciones: z.object({
    horas: z.string().optional(),
    presion: z.string().optional(),
    rs: z.string().optional(),
    st: z.string().optional(),
    rt: z.string().optional(),
    r: z.string().optional(),
    s: z.string().optional(),
    t: z.string().optional(),
    kw: z.string().optional(),
  }),
  observations_summary: z.string(),
});
export type ProcessDictationOutput = z.infer<
  typeof ProcessDictationOutputSchema
>;

export async function processDictation(
  input: ProcessDictationInput
): Promise<ProcessDictationOutput> {
  return processDictationFlow(input);
}

const processDictationPrompt = ai.definePrompt({
  name: 'processDictationPrompt',
  input: {schema: ProcessDictationInputSchema},
  output: {schema: ProcessDictationOutputSchema},
  prompt: `Analiza detalladamente este dictado técnico: "{{{dictation}}}".
    
    INSTRUCCIONES DE EXTRACCIÓN SÚPER ESTRICTAS Y PRIORITARIAS:
    1. IDENTIDAD: Extrae "Cliente" (ej. Doménica), "Instalación" (ej. Calderón), "Nº Grupo" (ej. 4), "Potencia" (ej. 12 KVA), "Marca" (ej. Hyundai), "Modelo" (ej. ang), "SN/Serie" (ej. 1714), "Persona que recibe" (ej. Guadalupe Flores).
    2. MEDICIONES: Extrae los valores numéricos correspondientes a: horas (ej. 100), presión de aceite (ej. 100), tensiones (RS, ST, RT), intensidades (R, S, T), y potencia con carga (kW).
    3. RECAMBIOS/PIEZAS: Presta MUCHA ATENCIÓN a los verbos. Si dice "cambio de", "se cambiaron", "reemplazo", debes asignar el valor "CMB" a la pieza mencionada (ej. Filtro de aceite -> CMB). Si dice "averiado", "descompuesto", "defecto", asigna "AVR" o "DEF".
    4. COMANDO MAESTRO OK: Si el técnico dice explícitamente "todos los niveles en okay", "marcar pendientes como okay", "todos los ítems revisados están okay", la respuesta "all_ok" DEBE ser true.
    
    Devuelve estrictamente un JSON con el schema definido.`,
});

const processDictationFlow = ai.defineFlow(
  {
    name: 'processDictationFlow',
    inputSchema: ProcessDictationInputSchema,
    outputSchema: ProcessDictationOutputSchema,
  },
  async input => {
    const {output} = await processDictationPrompt(input);
    return output!;
  }
);
