
// src/ai/flows/personalized-affirmations.ts
'use server';
/**
 * @fileOverview Flusso di Affermazioni Personalizzate Guidato da AI.
 *
 * Questo flusso genera affermazioni personalizzate basate sulle voci del diario dell'utente.
 * Aiuta gli utenti a sentirsi più supportati e potenziati per superare la dipendenza,
 * affrontando i loro specifici fattori scatenanti e sfide.
 *
 * @interface PersonalizedAffirmationsInput - Input per il flusso di affermazioni personalizzate.
 * @interface PersonalizedAffirmationsOutput - Output del flusso di affermazioni personalizzate.
 * @function generatePersonalizedAffirmations - Genera affermazioni personalizzate.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAffirmationsInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('La voce del diario dell\'utente contenente fattori scatenanti e umori.'),
});

export type PersonalizedAffirmationsInput = z.infer<typeof PersonalizedAffirmationsInputSchema>;

const PersonalizedAffirmationsOutputSchema = z.object({
  affirmation: z.string().describe('Un\'affermazione personalizzata basata sulla voce del diario.'),
});

export type PersonalizedAffirmationsOutput = z.infer<typeof PersonalizedAffirmationsOutputSchema>;

export async function generatePersonalizedAffirmations(
  input: PersonalizedAffirmationsInput
): Promise<PersonalizedAffirmationsOutput> {
  return personalizedAffirmationsFlow(input);
}

const personalizedAffirmationsPrompt = ai.definePrompt({
  name: 'personalizedAffirmationsPrompt',
  input: {schema: PersonalizedAffirmationsInputSchema},
  output: {schema: PersonalizedAffirmationsOutputSchema},
  prompt: `Basandoti sulla seguente voce del diario, genera un'affermazione personalizzata per aiutare l'utente a superare la sua dipendenza:\n\nVoce del Diario: {{{journalEntry}}}\n\nAffermazione: `,
});

const personalizedAffirmationsFlow = ai.defineFlow(
  {
    name: 'personalizedAffirmationsFlow',
    inputSchema: PersonalizedAffirmationsInputSchema,
    outputSchema: PersonalizedAffirmationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedAffirmationsPrompt(input);
    return output!;
  }
);
