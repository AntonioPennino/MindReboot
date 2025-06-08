
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { AppSettings, AlternativeActivity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ClientOnly from '@/components/ClientOnly';
import { DEFAULT_MOTIVATIONAL_MESSAGES, DEFAULT_ALTERNATIVE_ACTIVITIES } from '@/lib/constants';
import { PlusCircle, Trash2, Bell, BellOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const initialAppSettings: AppSettings = {
  notificationsEnabled: false,
  enableHourlyReminders: false,
  wakeTime: '08:00',
  sleepTime: '22:00',
  motivationalMessagesEnabled: true,
  customMotivationalMessages: [],
};

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.APP_SETTINGS, initialAppSettings);
  const [activities, setActivities] = useLocalStorage<AlternativeActivity[]>(STORAGE_KEYS.ALTERNATIVE_ACTIVITIES, DEFAULT_ALTERNATIVE_ACTIVITIES);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const { toast } = useToast();

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Notifiche non supportate", description: "Questo browser non supporta le notifiche desktop.", variant: "destructive" });
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return true;
      }
    }
    toast({ title: "Permesso Notifiche Negato", description: "Abilita le notifiche nelle impostazioni del tuo browser.", variant: "destructive"});
    return false;
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        handleSettingChange('notificationsEnabled', true);
        toast({ title: "Notifiche Abilitate", description: "Ora riceverai promemoria e messaggi motivazionali." });
      } else {
        handleSettingChange('notificationsEnabled', false); 
      }
    } else {
      handleSettingChange('notificationsEnabled', false);
      toast({ title: "Notifiche Disabilitate" });
    }
  };
  
  useEffect(() => {
    if (settings.notificationsEnabled && settings.enableHourlyReminders) {
      console.log("TODO: Pianificare promemoria orari tra le", settings.wakeTime, "e le", settings.sleepTime);
    }
    if(settings.notificationsEnabled && settings.motivationalMessagesEnabled) {
        console.log("TODO: Pianificare messaggi motivazionali casuali");
    }
  }, [settings]);


  const addCustomMessage = () => {
    const message = prompt("Inserisci nuovo messaggio motivazionale:");
    if (message && message.trim() !== "") {
        handleSettingChange('customMotivationalMessages', [...settings.customMotivationalMessages, message.trim()]);
    }
  }

  const removeCustomMessage = (index: number) => {
    const updatedMessages = [...settings.customMotivationalMessages];
    updatedMessages.splice(index, 1);
    handleSettingChange('customMotivationalMessages', updatedMessages);
  }

  const addActivity = () => {
    if(!newActivityName.trim()) return;
    setActivities([...activities, { id: crypto.randomUUID(), name: newActivityName, description: newActivityDesc }]);
    setNewActivityName('');
    setNewActivityDesc('');
  }

  const removeActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  }


  return (
    <ClientOnly fallback={<div className="text-center">Caricamento impostazioni...</div>}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Impostazioni App</h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Preferenze Notifiche</CardTitle>
            <CardDescription>Gestisci come e quando ricevi le notifiche.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="notificationsEnabled" className="flex flex-col space-y-1">
                <span>Abilita Tutte le Notifiche</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Ricevi promemoria e messaggi motivazionali.
                </span>
              </Label>
              <Switch
                id="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
              />
            </div>

            {settings.notificationsEnabled && (
              <>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <Label htmlFor="enableHourlyReminders" className="flex flex-col space-y-1">
                    <span>Promemoria Orari</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Ricevi delicati incoraggiamenti durante le ore di veglia.
                    </span>
                  </Label>
                  <Switch
                    id="enableHourlyReminders"
                    checked={settings.enableHourlyReminders}
                    onCheckedChange={(checked) => handleSettingChange('enableHourlyReminders', checked)}
                  />
                </div>
                {settings.enableHourlyReminders && (
                    <div className="grid grid-cols-2 gap-4 pl-4">
                        <div>
                            <Label htmlFor="wakeTime">Ora Sveglia</Label>
                            <Input id="wakeTime" type="time" value={settings.wakeTime} onChange={(e) => handleSettingChange('wakeTime', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="sleepTime">Ora Sonno</Label>
                            <Input id="sleepTime" type="time" value={settings.sleepTime} onChange={(e) => handleSettingChange('sleepTime', e.target.value)} />
                        </div>
                    </div>
                )}
                 <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <Label htmlFor="motivationalMessagesEnabled" className="flex flex-col space-y-1">
                    <span>Messaggi Motivazionali</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Ricevi messaggi edificanti casuali.
                    </span>
                  </Label>
                  <Switch
                    id="motivationalMessagesEnabled"
                    checked={settings.motivationalMessagesEnabled}
                    onCheckedChange={(checked) => handleSettingChange('motivationalMessagesEnabled', checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Messaggi Motivazionali Personalizzati</CardTitle>
                <CardDescription>Aggiungi i tuoi messaggi alla rotazione.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {DEFAULT_MOTIVATIONAL_MESSAGES.map((msg, i) => (
                    <p key={`def-${i}`} className="text-sm text-muted-foreground italic">"{msg}"</p>
                ))}
                {settings.customMotivationalMessages.map((msg, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <p className="text-sm">"{msg}"</p>
                        <Button variant="ghost" size="icon" onClick={() => removeCustomMessage(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={addCustomMessage}><PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Messaggio</Button>
            </CardFooter>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Attività Alternative</CardTitle>
                <CardDescription>Gestisci l'elenco delle attività per il Pulsante Panico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newActivityName">Nome Attività</Label>
                    <Input id="newActivityName" value={newActivityName} onChange={(e) => setNewActivityName(e.target.value)} placeholder="es. Respirazione profonda per 5 min"/>
                    <Label htmlFor="newActivityDesc">Descrizione (Opzionale)</Label>
                    <Textarea id="newActivityDesc" value={newActivityDesc} onChange={(e) => setNewActivityDesc(e.target.value)} placeholder="Brevi dettagli sull'attività"/>
                    <Button onClick={addActivity}><PlusCircle className="mr-2 h-4 w-4"/> Aggiungi Attività</Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {activities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                                <p className="font-medium">{activity.name}</p>
                                {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeActivity(activity.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

      </div>
    </ClientOnly>
  );
}
