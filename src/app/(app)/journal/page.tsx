
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import JournalEntryForm from '@/components/JournalEntryForm';
import ClientOnly from '@/components/ClientOnly';
import { Edit, Trash2 } from 'lucide-react';

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = (newEntryData: Omit<JournalEntry, 'id' | 'date' | 'isoDate'>) => {
    const now = new Date();
    const newEntry: JournalEntry = {
      ...newEntryData,
      id: crypto.randomUUID(),
      date: now.toISOString(),
      isoDate: format(now, 'yyyy-MM-dd'),
    };
    setJournalEntries([newEntry, ...journalEntries]);
    setShowForm(false);
  };

  const handleUpdateEntry = (updatedEntryData: Omit<JournalEntry, 'date' | 'isoDate'> & { id: string }) => {
    setJournalEntries(
      journalEntries.map((entry) =>
        entry.id === updatedEntryData.id ? { ...entry, ...updatedEntryData, date: entry.date, isoDate: entry.isoDate } : entry
      )
    );
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa voce?')) {
      setJournalEntries(journalEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleEditClick = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  }

  const handleCancelForm = () => {
    setEditingEntry(null);
    setShowForm(false);
  }

  const sortedEntries = journalEntries.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <ClientOnly fallback={<div className="text-center">Caricamento voci del diario...</div>}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Diario Personale</h1>
          {!showForm && (
            <Button onClick={() => { setEditingEntry(null); setShowForm(true); }}>Nuova Voce</Button>
          )}
        </div>

        {showForm && (
          <JournalEntryForm
            entry={editingEntry}
            onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
            onCancel={handleCancelForm}
          />
        )}

        {sortedEntries.length === 0 && !showForm ? (
          <p className="text-muted-foreground">Nessuna voce nel diario ancora. Inizia aggiungendone una nuova.</p>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <Card key={entry.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{format(parseISO(entry.date), "d MMMM yyyy - HH:mm", { locale: it })}</CardTitle>
                  {entry.mood && <CardDescription>Umore: {entry.mood}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                  {entry.triggers && entry.triggers.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Fattori Scatenanti: {entry.triggers.join(', ')}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(entry)}>
                    <Edit className="mr-2 h-4 w-4" /> Modifica
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteEntry(entry.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Elimina
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
