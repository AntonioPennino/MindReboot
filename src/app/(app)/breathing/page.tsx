
'use client';

import BreathingGuide from '@/components/BreathingGuide';
import ClientOnly from '@/components/ClientOnly';

export default function BreathingPage() {
  return (
    <ClientOnly fallback={<div className="text-center">Caricamento esercizio di respirazione...</div>}>
      <div className="space-y-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">Respirazione Consapevole</h1>
        <BreathingGuide />
      </div>
    </ClientOnly>
  );
}
