
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { SobrietyData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { differenceInDays, format, parseISO, addDays, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import ClientOnly from '@/components/ClientOnly';
import { Award, CalendarX, TrendingUp, CalendarCheck } from 'lucide-react';

const initialSobrietyData: SobrietyData = {
  startDate: null,
  relapses: [],
};

export default function DashboardPage() {
  const [sobrietyData, setSobrietyData] = useLocalStorage<SobrietyData>(STORAGE_KEYS.SOBRIETY_DATA, initialSobrietyData);
  const [daysSober, setDaysSober] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [monthlySuccessRate, setMonthlySuccessRate] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (sobrietyData.startDate) {
      const start = parseISO(sobrietyData.startDate);
      const today = new Date();
      
      let currentStreak = 0;
      let maxStreak = 0;
      // let lastRelapseDate = start; // unused

      const sortedRelapses = sobrietyData.relapses
        .map(r => parseISO(r))
        .sort((a, b) => a.getTime() - b.getTime());

      if (sortedRelapses.length > 0) {
        const mostRecentRelapse = sortedRelapses[sortedRelapses.length - 1];
        if (mostRecentRelapse >= start) {
          currentStreak = differenceInDays(today, mostRecentRelapse);
          // lastRelapseDate = mostRecentRelapse; // unused
        } else {
           currentStreak = differenceInDays(today, start);
        }
      } else {
        currentStreak = differenceInDays(today, start);
      }
      setDaysSober(currentStreak > 0 ? currentStreak : 0);
      
      let currentPeriodStart = start;
      for (const relapse of sortedRelapses) {
        if (relapse > currentPeriodStart) {
          const streak = differenceInDays(relapse, currentPeriodStart);
          if (streak > maxStreak) {
            maxStreak = streak;
          }
          currentPeriodStart = relapse;
        }
      }
      const finalStreak = differenceInDays(today, currentPeriodStart);
      if (finalStreak > maxStreak) {
        maxStreak = finalStreak;
      }
      setLongestStreak(maxStreak > 0 ? maxStreak : (daysSober > 0 ? daysSober : 0));


      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      // const daysInMonth = differenceInDays(monthEnd, monthStart) + 1; // unused
      let relapseDaysInMonth = 0;
      sortedRelapses.forEach(relapse => {
        if (relapse >= monthStart && relapse <= monthEnd && relapse >= start) { 
          relapseDaysInMonth++;
        }
      });
      
      const relevantDaysInMonth = eachDayOfInterval({start: Math.max(monthStart.getTime(), start.getTime()), end: monthEnd}).length;
      const successfulDaysInSobrietyPeriodForMonth = Math.max(0, relevantDaysInMonth - relapseDaysInMonth);
      setMonthlySuccessRate(relevantDaysInMonth > 0 ? Math.round((successfulDaysInSobrietyPeriodForMonth / relevantDaysInMonth) * 100) : 0);

    } else {
      setDaysSober(0);
      setLongestStreak(0);
      setMonthlySuccessRate(0);
    }
  }, [sobrietyData, daysSober]); // Added daysSober to dependencies as per original code logic for maxStreak

  const handleSetStartDate = () => {
    setSobrietyData({ startDate: new Date().toISOString().split('T')[0], relapses: [] });
  };

  const handleMarkRelapse = () => {
    if (selectedDate && sobrietyData.startDate) {
      const selectedDayString = format(selectedDate, 'yyyy-MM-dd');
      if (!sobrietyData.relapses.includes(selectedDayString) && parseISO(selectedDayString) >= parseISO(sobrietyData.startDate)) {
        setSobrietyData({ 
          ...sobrietyData, 
          relapses: [...sobrietyData.relapses, selectedDayString].sort() 
        });
      }
    }
  };
  
  const relapseDates = sobrietyData.relapses.map(r => parseISO(r));
  const startDateDate = sobrietyData.startDate ? parseISO(sobrietyData.startDate) : null;

  const modifiers = { 
    relapse: relapseDates,
    soberDay: (date: Date) => {
      if (!startDateDate || date < startDateDate || date > new Date()) return false;
      return !relapseDates.some(relapseDate => isSameDay(date, relapseDate));
    },
    startDate: startDateDate ? [startDateDate] : []
  };

  const modifiersStyles = {
    relapse: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', borderRadius: 'var(--radius)' },
    soberDay: { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))', borderRadius: 'var(--radius)' },
    startDate: { fontWeight: 'bold', border: '2px solid hsl(var(--primary))', borderRadius: 'var(--radius)'}
  };


  return (
    <ClientOnly fallback={<div className="text-center">Caricamento dati sobrietà...</div>}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Pannello di Controllo Sobrietà</h1>

        {!sobrietyData.startDate ? (
          <Card>
            <CardHeader>
              <CardTitle>Inizia il Tuo Viaggio</CardTitle>
              <CardDescription>Inizia a tracciare la tua sobrietà impostando la data di inizio.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSetStartDate}>Inizio Oggi</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serie Attuale</CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{daysSober}</div>
                  <p className="text-xs text-muted-foreground">giorni sobrio/a</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Serie Più Lunga</CardTitle>
                  <Award className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{longestStreak}</div>
                  <p className="text-xs text-muted-foreground">giorni in totale</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successo Mese Corrente</CardTitle>
                  <CalendarCheck className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{monthlySuccessRate}%</div>
                  <p className="text-xs text-muted-foreground">giorni sobri questo mese</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Calendario Progressi</CardTitle>
                <CardDescription>Visualizza il tuo viaggio. Seleziona un giorno per segnare una ricaduta se necessario.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center md:flex-row md:items-start gap-4">
                <Calendar
                  locale={it}
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  disabled={(date) => sobrietyData.startDate ? date < parseISO(sobrietyData.startDate) || date > new Date() : true}
                />
                <div className="flex flex-col gap-2 items-center md:items-start">
                  {selectedDate && sobrietyData.startDate && selectedDate >= parseISO(sobrietyData.startDate) && selectedDate <= new Date() && (
                    <Button onClick={handleMarkRelapse} variant="destructive">
                       <CalendarX className="mr-2 h-4 w-4"/> Segna Ricaduta il {format(selectedDate, 'd MMM', { locale: it })}
                    </Button>
                  )}
                  <Button onClick={() => {
                    if(confirm("Sei sicuro di voler azzerare tutti i tuoi dati di sobrietà? Questa azione non può essere annullata.")) {
                      setSobrietyData(initialSobrietyData);
                    }
                  }} variant="outline">Azzera Tutti i Dati</Button>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={modifiersStyles.soberDay}></span> Giorno Sobrio/a</div>
                    <div className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={modifiersStyles.relapse}></span> Giorno di Ricaduta</div>
                    <div className="flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-[hsl(var(--primary))]"></span> Data di Inizio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ClientOnly>
  );
}
