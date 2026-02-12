'use server';
/**
 * @fileOverview A Genkit flow for suggesting predictive maintenance tasks based on asset data and historical inspection reports.
 *
 * - predictiveMaintenanceSuggestion - A function that handles the predictive maintenance suggestion process.
 * - PredictiveMaintenanceSuggestionInput - The input type for the predictiveMaintenanceSuggestion function.
 * - PredictiveMaintenanceSuggestionOutput - The return type for the predictiveMaintenanceSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema
const PredictiveMaintenanceSuggestionInputSchema = z.object({
  assetId: z.string().describe('The unique identifier of the asset.'),
  assetCategory: z.enum(['Energía', 'BHS', 'Clima']).describe('The category of the asset.'),
  assetModel: z.string().describe('The brand and model of the asset.'),
  assetSerialNumber: z.string().describe('The serial number of the asset.'),
  assetPower: z.string().describe('The power rating of the asset.'),
  historicalReports: z.array(
    z.object({
      reportId: z.string().describe('The unique identifier of the inspection report.'),
      reportDate: z.string().datetime().describe('The date and time when the report was finalized (ISO 8601 format).'),
      inspectionResults: z.record(
        z.enum(['N/A', 'OPT', 'ACU', 'PAR', 'OFE'])
      ).describe('A map where keys are inspection fields (e.g., "Motor", "Sistema Eléctrico") and values are their status (N/A, OPT, ACU, PAR, OFE).'),
    })
  ).describe('An array of historical inspection reports for the asset.'),
});
export type PredictiveMaintenanceSuggestionInput = z.infer<typeof PredictiveMaintenanceSuggestionInputSchema>;

// Define the output schema
const PredictiveMaintenanceSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      description: z.string().describe('A detailed description of the suggested maintenance task.'),
      reason: z.string().describe('The reasoning behind this maintenance suggestion, based on historical data.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level for the suggested maintenance task.'),
      assetComponent: z.string().describe('The specific component of the asset that requires attention.'),
    })
  ).describe('An array of suggested predictive maintenance tasks.'),
});
export type PredictiveMaintenanceSuggestionOutput = z.infer<typeof PredictiveMaintenanceSuggestionOutputSchema>;

// Define the prompt
const predictiveMaintenancePrompt = ai.definePrompt({
  name: 'predictiveMaintenancePrompt',
  input: { schema: PredictiveMaintenanceSuggestionInputSchema },
  output: { schema: PredictiveMaintenanceSuggestionOutputSchema },
  prompt: `You are an expert Senior Maintenance Manager specializing in industrial assets for Energy Engine España. Your task is to analyze asset data and its historical inspection reports to provide proactive maintenance suggestions.

Analyze the provided asset details and its inspection history. Look for patterns, recurring issues (e.g., "ACU", "PAR", "OFE" statuses for specific components), or trends that might indicate potential failures or upcoming maintenance needs.

Based on your analysis, provide a list of predictive maintenance suggestions. Each suggestion must include:
- A clear description of the maintenance task.
- A detailed reason explaining why this maintenance is suggested, referencing the historical data where appropriate.
- A priority level (High, Medium, or Low).
- The specific component of the asset that needs attention.

---
Asset Details:
ID: {{{assetId}}}
Category: {{{assetCategory}}}
Model: {{{assetModel}}}
Serial Number: {{{assetSerialNumber}}}
Power: {{{assetPower}}}

---
Historical Inspection Reports:
{{#if historicalReports}}
  {{#each historicalReports}}
    Report ID: {{{reportId}}}
    Report Date: {{{reportDate}}}
    Inspection Results:
    {{#each inspectionResults}}
      - {{ @key }}: {{ this }}
    {{/each}}
  {{/each}}
{{else}}
  No historical inspection reports available for this asset.
{{/if}}

---
Maintenance Suggestions:
`,
});

// Define the flow
const predictiveMaintenanceSuggestionFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceSuggestionFlow',
    inputSchema: PredictiveMaintenanceSuggestionInputSchema,
    outputSchema: PredictiveMaintenanceSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await predictiveMaintenancePrompt(input);
    return output!;
  }
);

// Wrapper function to expose the flow
export async function predictiveMaintenanceSuggestion(
  input: PredictiveMaintenanceSuggestionInput
): Promise<PredictiveMaintenanceSuggestionOutput> {
  return predictiveMaintenanceSuggestionFlow(input);
}
