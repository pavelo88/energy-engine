'use server';
/**
 * @fileOverview A Genkit flow for generating a summary for an inspection report.
 *
 * - inspectionSummarySuggestion - A function that handles the inspection summary generation.
 * - InspectionSummaryInput - The input type for the function.
 * - InspectionSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InspectionSummaryInputSchema = z.record(z.string()).describe('An object representing the inspection checklist, where keys are inspection points and values are their status (e.g., OPT, DEF, PAR).');
export type InspectionSummaryInput = z.infer<typeof InspectionSummaryInputSchema>;

const InspectionSummaryOutputSchema = z.object({
    core_issue: z.string().describe("A concise summary of the main problem or observation found during the inspection. If no issues, state that it was a routine check with no anomalies."),
    recommended_actions: z.string().describe("The recommended actions to take based on the inspection findings. If no issues, recommend continuing with the standard maintenance plan."),
    potential_impact: z.string().describe("The potential negative impact if the recommended actions are not taken. If no issues, state there is no immediate risk."),
});
export type InspectionSummaryOutput = z.infer<typeof InspectionSummaryOutputSchema>;

export async function inspectionSummarySuggestion(input: InspectionSummaryInput): Promise<InspectionSummaryOutput> {
    return inspectionSummarySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inspectionSummarySuggestionPrompt',
  input: {schema: InspectionSummaryInputSchema},
  output: {schema: InspectionSummaryOutputSchema},
  prompt: `You are a senior maintenance technician generating a report summary. Based on the following checklist results, provide a concise and professional summary.

Focus on items marked as 'DEF' (Defect), 'ACU' (Actuación), 'PAR' (Stopped), or 'OFE' (To Offer). If all items are 'OPT' (Optimal) or 'N/A', indicate that the inspection was routine and no issues were found.

Checklist Data:
{{#each this}}
- {{@key}}: {{this}}
{{/each}}

Based on this, fill in the following fields:
- core_issue: What is the single most important issue?
- recommended_actions: What are the immediate next steps?
- potential_impact: What could happen if no action is taken?
`,
});

const inspectionSummarySuggestionFlow = ai.defineFlow(
  {
    name: 'inspectionSummarySuggestionFlow',
    inputSchema: InspectionSummaryInputSchema,
    outputSchema: InspectionSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
