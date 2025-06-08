
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import ClientOnly from '@/components/ClientOnly';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEYS.GOALS, []);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'weekly' | 'monthly'>('weekly');

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: newGoalText,
      type: newGoalType,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setGoals([newGoal, ...goals]);
    setNewGoalText('');
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed, completedAt: !goal.completed ? new Date().toISOString() : null } : goal
      )
    );
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo obiettivo?')) {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
  };

  const sortedGoals = goals.sort((a,b) => (a.completed === b.completed) ? (parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()) : (a.completed ? 1 : -1) );

  const getGoalTypeLabel = (type: 'weekly' | 'monthly') => {
    return type === 'weekly' ? 'Settimanale' : 'Mensile';
  }

  return (
    <ClientOnly fallback={<div className="text-center">Caricamento obiettivi...</div>}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Imposta i Tuoi Obiettivi</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Aggiungi un Nuovo Obiettivo</CardTitle>
            <CardDescription>Definisci cosa vuoi raggiungere questa settimana o questo mese.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="es. Meditare 10 minuti al giorno"
            />
            <Select value={newGoalType} onValueChange={(value: 'weekly' | 'monthly') => setNewGoalType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo di Obiettivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Settimanale</SelectItem>
                <SelectItem value="monthly">Mensile</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddGoal} disabled={!newGoalText.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Obiettivo
            </Button>
          </CardFooter>
        </Card>

        {goals.length === 0 ? (
          <p className="text-muted-foreground">Nessun obiettivo impostato. Aggiungine uno per iniziare!</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">I Tuoi Obiettivi</h2>
            {sortedGoals.map((goal) => (
              <Card key={goal.id} className={`shadow-sm ${goal.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoalCompletion(goal.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`goal-${goal.id}`}
                        className={`text-base font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {goal.text}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Obiettivo {getGoalTypeLabel(goal.type)} - Creato: {format(parseISO(goal.createdAt), 'd MMM yyyy', { locale: it })}
                        {goal.completed && goal.completedAt && ` - Completato: ${format(parseISO(goal.completedAt), 'd MMM yyyy', { locale: it })}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
