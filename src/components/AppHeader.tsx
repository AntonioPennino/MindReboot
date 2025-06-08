
import Link from 'next/link';
import { APP_LOGO_ICON, APP_NAME, PANIC_BUTTON_ICON } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { AlternativeActivity } from '@/lib/types';
import { DEFAULT_ALTERNATIVE_ACTIVITIES } from '@/lib/constants';


export function AppHeader() {
  const router = useRouter();
  const [alternativeActivities] = useLocalStorage<AlternativeActivity[]>(STORAGE_KEYS.ALTERNATIVE_ACTIVITIES, DEFAULT_ALTERNATIVE_ACTIVITIES);

  const navigateToBreathing = () => {
    router.push('/breathing');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/dashboard" className="flex items-center gap-2">
            <APP_LOGO_ICON className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{APP_NAME}</span>
          </Link>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <PANIC_BUTTON_ICON className="mr-2 h-4 w-4" />
              Pulsante Panico
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Supporto Immediato</DialogTitle>
              <DialogDescription>
                Ti senti sopraffatto/a? Scegli un'attività che ti aiuti a ritrovare la calma e la concentrazione.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={navigateToBreathing} variant="outline">
                Esercizio di Respirazione Guidata
              </Button>
              {alternativeActivities.slice(0,3).map(activity => (
                 <Button key={activity.id} variant="outline" onClick={() => alert(`Proviamo: ${activity.name}\n${activity.description || ''}`)}>
                   {activity.name}
                 </Button>
              ))}
            </div>
            <DialogFooter>
              <span className="text-sm text-muted-foreground">Sei forte. Puoi superare questo momento.</span>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
