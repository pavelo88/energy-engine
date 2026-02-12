'use server';
/**
 * @fileOverview A Genkit flow for generating concise summaries of critical inspection reports.
 *
 * - criticalReportSummary - A function that handles the generation of critical report summaries.
 * - CriticalReportInput - The input type for the criticalReportSummary function.
 * - CriticalReportSummaryOutput - The return type for the criticalReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema: Array of inspection reports
const CriticalReportItemSchema = z.object({
  id_informe: z.string().describe('Unique identifier for the inspection report.'),
  id_bien: z.string().describe('Unique identifier for the asset.'),
  estado: z.enum(['Operativo', 'Alerta', 'Mantenimiento', 'PAR', 'OFE']).describe('Status of the asset during inspection. \'PAR\' means "Stopped" and \'OFE\' means "To Offer".'),
  core_issue: z.string().describe('Description of the core problem identified.'),
  recommended_actions: z.string().describe('Actions recommended by the inspector.'),
  potential_impact: z.string().describe('Potential consequences if the issue is not addressed.'),
});

const CriticalReportInputSchema = z.array(CriticalReportItemSchema).describe('An array of inspection reports.');
export type CriticalReportInput = z.infer<typeof CriticalReportInputSchema>;

// Output Schema: Array of summary objects for critical reports
const CriticalReportSummaryItemSchema = z.object({
  reportId: z.string().describe('The unique identifier of the critical report.'),
  assetId: z.string().describe('The unique identifier of the asset associated with the critical report.'),
  summary: z.string().describe('A concise summary highlighting the core issue, recommended immediate actions, and potential impact for the critical report.'),
});

const CriticalReportSummaryOutputSchema = z.array(CriticalReportSummaryItemSchema).describe('An array of concise summaries for critical inspection reports (status PAR or OFE).');
export type CriticalReportSummaryOutput = z.infer<typeof CriticalReportSummaryOutputSchema>;

// Wrapper function
export async function criticalReportSummary(input: CriticalReportInput): Promise<CriticalReportSummaryOutput> {
  return criticalReportSummaryFlow(input);
}

// Prompt definition
const criticalReportPrompt = ai.definePrompt({
  name: 'criticalReportSummaryPrompt',
  input: {schema: CriticalReportInputSchema},
  output: {schema: CriticalReportSummaryOutputSchema},
  prompt: `As a manager, I need concise summaries of critical inspection reports. For each report provided, generate a summary that highlights the core issue, recommended immediate actions, and potential impact.
  
  Only summarize reports where the 'estado' is 'PAR' (Parada) or 'OFE' (Ofertar). If there are no such reports, return an empty array.
  
  For each critical report, structure the summary as follows:
  
  Example Output Format for a single critical report:
  {
    "reportId": "report-123",
    "assetId": "asset-abc",
    "summary": "Report ID report-123 for Asset ID asset-abc indicates a critical 'PAR' status due to [core_issue]. Immediate action recommended: [recommended_actions]. Failure to address this could lead to [potential_impact]."
  }
  
  Here are the inspection reports to consider:
  
  {{#each this as |report|}}
    {{#if (or (eq report.estado "PAR") (eq report.estado "OFE"))}}
      Report ID: {{report.id_informe}}
      Asset ID: {{report.id_bien}}
      Status: {{report.estado}}
      Core Issue: {{report.core_issue}}
      Recommended Actions: {{report.recommended_actions}}
      Potential Impact: {{report.potential_impact}}
      ---
    {{/if}}
  {{/each}}
  
  Generate a JSON array of summaries following the output schema. Ensure each summary is concise and actionable.
  `,
});

// Flow definition
const criticalReportSummaryFlow = ai.defineFlow(
  {
    name: 'criticalReportSummaryFlow',
    inputSchema: CriticalReportInputSchema,
    outputSchema: CriticalReportSummaryOutputSchema,
  },
  async (reports) => {
    const {output} = await criticalReportPrompt(reports);
    return output!;
  }
);
