
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

const phases = [
  { name: 'Inspira', duration: 4, instruction: 'Inspira lentamente attraverso il naso...' },
  { name: 'Trattieni', duration: 7, instruction: 'Trattieni il respiro...' },
  { name: 'Espira', duration: 8, instruction: 'Espira lentamente attraverso la bocca...' },
];

export default function BreathingGuide() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

  const resetExercise = useCallback(() => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setCountdown(phases[0].duration);
    setCycles(0);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setCurrentPhaseIndex(nextPhaseIndex);
        setCountdown(phases[nextPhaseIndex].duration);
        if (nextPhaseIndex === 0) {
          setCycles(prev => prev + 1);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, countdown, currentPhaseIndex]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const currentPhase = phases[currentPhaseIndex];
  const progressPercentage = isRunning ? ((currentPhase.duration - countdown) / currentPhase.duration) * 100 : 0;


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Respirazione Guidata (4-7-8)</CardTitle>
        <CardDescription className="text-center">
          Segui le istruzioni per calmare la mente e il corpo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center text-center">
          <div 
            className="absolute inset-0 rounded-full bg-primary/20 transition-all duration-1000 ease-linear" 
            style={{ transform: `scale(${isRunning ? (currentPhase.name === 'Inspira' ? (progressPercentage / 100) * 0.8 + 0.2 : (currentPhase.name === 'Espira' ? (1 - progressPercentage / 100) * 0.8 + 0.2 : 1)) : 0.2})` }}
          />
          <div className="z-10">
            <p className="text-3xl font-bold">{currentPhase.name}</p>
            <p className="text-5xl font-mono">{countdown}</p>
          </div>
        </div>
        
        <p className="text-lg text-center h-12">{isRunning ? currentPhase.instruction : "Premi Start per iniziare"}</p>
        
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={toggleRunning} size="lg">
            {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isRunning ? 'Pausa' : 'Inizia'}
          </Button>
          <Button onClick={resetExercise} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Azzera
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Cicli completati: {cycles}</p>
      </CardContent>
    </Card>
  );
}
