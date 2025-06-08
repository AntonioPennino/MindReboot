
'use client';

import { useState } from 'react';
import type { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface JournalEntryFormProps {
  entry?: JournalEntry | null;
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'date' | 'isoDate'> & { id?: string }) => void;
  onCancel?: () => void;
}

export default function JournalEntryForm({ entry, onSubmit, onCancel }: JournalEntryFormProps) {
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || '');
  const [triggers, setTriggers] = useState(entry?.triggers?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: entry?.id,
      content,
      mood: mood || undefined,
      triggers: triggers ? triggers.split(',').map(t => t.trim()).filter(t => t) : undefined,
    });
    if (!entry) {
        setContent('');
        setMood('');
        setTriggers('');
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>{entry ? 'Modifica Voce del Diario' : 'Nuova Voce del Diario'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="journalContent">Contenuto</Label>
            <Textarea
              id="journalContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Scrivi dei tuoi pensieri, sentimenti ed esperienze..."
              rows={6}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="journalMood">Umore (Opzionale)</Label>
            <Input
              id="journalMood"
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="es. Ansioso/a, Speranzoso/a, Stanco/a"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="journalTriggers">Fattori Scatenanti (Opzionale, separati da virgola)</Label>
            <Input
              id="journalTriggers"
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="es. Stress, Noia, Solitudine"
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          )}
          <Button type="submit">{entry ? 'Salva Modifiche' : 'Aggiungi Voce'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
