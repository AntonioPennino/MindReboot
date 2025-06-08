
import type { LucideIcon } from 'lucide-react';
import { Activity, CalendarCheck, BookOpenText, Sparkles, Target, Wind, Settings, ShieldAlert } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Pannello', icon: CalendarCheck },
  { path: '/journal', label: 'Diario', icon: BookOpenText },
  { path: '/affirmations', label: 'Affermazioni', icon: Sparkles },
  { path: '/goals', label: 'Obiettivi', icon: Target },
  { path: '/breathing', label: 'Respirazione', icon: Wind },
  { path: '/settings', label: 'Impostazioni', icon: Settings },
];

export const APP_NAME = "Rinascita Mentale";
export const APP_LOGO_ICON = Activity;
export const PANIC_BUTTON_ICON = ShieldAlert;


export const DEFAULT_MOTIVATIONAL_MESSAGES: string[] = [
  "Ogni passo avanti è una vittoria.",
  "Sei più forte delle tue compulsioni.",
  "Credi nella tua capacità di cambiare.",
  "Un giorno alla volta. Ce la puoi fare.",
  "Il tuo percorso è unico e valido.",
  "Abbraccia il processo di guarigione.",
  "Un piccolo progresso è pur sempre un progresso.",
  "Sii gentile con te stesso oggi.",
  "Non sei solo in questo.",
  "Concentrati sul tuo 'perché'."
];

export const DEFAULT_ALTERNATIVE_ACTIVITIES = [
    { id: '1', name: 'Fai una breve passeggiata' },
    { id: '2', name: 'Ascolta musica rilassante' },
    { id: '3', name: 'Dedica 15 minuti a un hobby' },
    { id: '4', name: 'Chiama un amico o un familiare' },
    { id: '5', name: 'Scrivi 3 cose per cui sei grato' },
    { id: '6', name: 'Fai una breve routine di stretching di 5 minuti' }
];
