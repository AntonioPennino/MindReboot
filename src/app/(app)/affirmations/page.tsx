
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generatePersonalizedAffirmations } from '@/ai/flows/personalized-affirmations';
import AffirmationCard from '@/components/AffirmationCard';
import ClientOnly from '@/components/ClientOnly';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export default function AffirmationsPage() {
  const [journalEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>(undefined);
  const [customInput, setCustomInput] = useState('');
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedEntries = journalEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleGenerateAffirmation = async () => {
    setIsLoading(true);
    setError(null);
    setAffirmation(null);

    let journalText = customInput;
    if (!journalText && selectedEntryId) {
      const entry = journalEntries.find(e => e.id === selectedEntryId);
      if (entry) {
        journalText = entry.content;
      }
    }

    if (!journalText.trim()) {
      setError('Seleziona una voce del diario o fornisci un testo personalizzato.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generatePersonalizedAffirmations({ journalEntry: journalText });
      setAffirmation(result.affirmation);
    } catch (err) {
      console.error('Errore durante la generazione dell\'affermazione:', err);
      setError('Impossibile generare l\'affermazione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (sortedEntries.length > 0 && !selectedEntryId) {
      setSelectedEntryId(sortedEntries[0].id);
    }
  }, [sortedEntries, selectedEntryId]);


  return (
    <ClientOnly fallback={<div className="text-center">Caricamento strumento affermazioni...</div>}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Affermazioni Personalizzate</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Genera un'Affermazione</CardTitle>
            <CardDescription>
              Seleziona una voce di diario passata o scrivi dei tuoi sentimenti attuali per generare un'affermazione personalizzata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedEntries.length > 0 && (
                 <div>
                    <label htmlFor="journalSelect" className="block text-sm font-medium text-foreground mb-1">
                    Seleziona Voce del Diario (Opzionale)
                    </label>
                    <Select value={selectedEntryId} onValueChange={setSelectedEntryId}>
                    <SelectTrigger id="journalSelect" className="w-full">
                        <SelectValue placeholder="Scegli una voce..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sortedEntries.map(entry => (
                        <SelectItem key={entry.id} value={entry.id}>
                            {format(parseISO(entry.date), 'd MMM yyyy', { locale: it })} - {entry.content.substring(0, 50)}...
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
              </div>
            )}
            <div>
              <label htmlFor="customInput" className="block text-sm font-medium text-foreground mb-1">
                Oppure Scrivi dei Tuoi Sentimenti/Situazione Attuale
              </label>
              <Textarea
                id="customInput"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="es. Mi sento stressato per il lavoro e temo di poter ricadere."
                rows={4}
              />
            </div>
            <Button onClick={handleGenerateAffirmation} disabled={isLoading || (!selectedEntryId && !customInput.trim())}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Genera Affermazione
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-destructive">{error}</p>}

        {affirmation && <AffirmationCard affirmation={affirmation} />}
      </div>
    </ClientOnly>
  );
}
