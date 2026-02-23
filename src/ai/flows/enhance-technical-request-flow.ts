'use server';
/**
 * @fileOverview A Genkit flow to enhance technical assistance requests.
 *
 * - enhanceTechnicalRequest - A function that enhances a technical request using AI.
 * - EnhanceTechnicalRequestInput - The input type for the enhanceTechnicalRequest function.
 * - EnhanceTechnicalRequestOutput - The return type for the enhanceTechnicalRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceTechnicalRequestInputSchema = z.object({
  technicalRequest: z
    .string()
    .describe('The original technical assistance request from the customer.'),
});
export type EnhanceTechnicalRequestInput = z.infer<
  typeof EnhanceTechnicalRequestInputSchema
>;

const EnhanceTechnicalRequestOutputSchema = z.object({
  improved: z.string().describe('The AI-enhanced, formal, and professional technical request.'),
  extra: z.object({
    cliente: z.string().optional().describe("El nombre del cliente si se menciona."),
    modelo: z.string().optional().describe("El modelo del equipo si se menciona."),
    sn: z.string().optional().describe("El número de serie del equipo si se menciona."),
    n_grupo: z.string().optional().describe("El número de grupo si se menciona."),
    potencia: z.string().optional().describe("La potencia del equipo si se menciona."),
    recibe: z.string().optional().describe("La persona que recibe el informe si se menciona."),
  }).describe("Datos adicionales extraídos del informe."),
});
export type EnhanceTechnicalRequestOutput = z.infer<
  typeof EnhanceTechnicalRequestOutputSchema
>;

export async function enhanceTechnicalRequest(
  input: EnhanceTechnicalRequestInput
): Promise<EnhanceTechnicalRequestOutput> {
  return enhanceTechnicalRequestFlow(input);
}

const enhanceTechnicalRequestPrompt = ai.definePrompt({
  name: 'enhanceTechnicalRequestPrompt',
  input: {schema: EnhanceTechnicalRequestInputSchema},
  output: {schema: EnhanceTechnicalRequestOutputSchema},
  system: 'You are an expert engineer. Your task is to rephrase and enhance technical assistance requests to be clear, formal, and professional. You should also extract any missing key information you find in the text.',
  prompt: `Original technical request: """{{{technicalRequest}}}"""`,
});

const enhanceTechnicalRequestFlow = ai.defineFlow(
  {
    name: 'enhanceTechnicalRequestFlow',
    inputSchema: EnhanceTechnicalRequestInputSchema,
    outputSchema: EnhanceTechnicalRequestOutputSchema,
  },
  async input => {
    const {output} = await enhanceTechnicalRequestPrompt(input);
    return output!;
  }
);
