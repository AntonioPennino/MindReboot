# Rinascita Mentale (MindReboot)

Rinascita Mentale è un'applicazione web progettata per supportare gli utenti nel loro percorso di crescita personale e nel superamento di cattive abitudini, con un focus sul benessere mentale. L'app offre una suite di strumenti per monitorare i progressi, coltivare la consapevolezza e mantenere la motivazione.

## Caratteristiche Principali

*   **Pannello di Controllo (Dashboard):** Visualizza i progressi nella sobrietà, inclusi i giorni senza ricadute, la striscia più lunga e le statistiche mensili. Gestito in `src/app/(app)/dashboard/page.tsx`.
*   **Diario Personale:** Uno spazio per annotare pensieri, sentimenti, umore e possibili trigger, aiutando nell'auto-riflessione. Gestito in `src/app/(app)/journal/page.tsx` e `src/components/JournalEntryForm.tsx`.
*   **Affermazioni Positive:** Accesso a una collezione di affermazioni e la possibilità di generarne di personalizzate (potenzialmente tramite IA, data la struttura in `src/ai/`). Gestito in `src/app/(app)/affirmations/page.tsx`.
*   **Gestione Obiettivi:** Imposta e monitora obiettivi settimanali o mensili per mantenere il focus e celebrare i traguardi. Gestito in `src/app/(app)/goals/page.tsx`.
*   **Guida alla Respirazione:** Esercizi di respirazione guidata (come la tecnica 4-7-8) per aiutare a calmare la mente e ridurre lo stress. Implementato in `src/components/BreathingGuide.tsx` e utilizzato in `src/app/(app)/breathing/page.tsx`.
*   **Impostazioni Personalizzabili:** Gestite in `src/app/(app)/settings/page.tsx`.
    *   Gestione delle notifiche (promemoria orari, messaggi motivazionali).
    *   Definizione di orari di veglia e sonno.
    *   Personalizzazione dei messaggi motivazionali (con messaggi di default in `src/lib/constants.ts`).
    *   Elenco di attività alternative da svolgere in momenti di difficoltà.
*   **Pulsante Panico:** Accesso rapido a risorse o strategie di coping (l'icona `PANIC_BUTTON_ICON` è definita in `src/lib/constants.ts`, suggerendo questa funzionalità).

## Stack Tecnologico

*   **Frontend:** Next.js (React Framework)
*   **Linguaggio:** TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui (come si evince dalla struttura dei componenti in `src/components/ui/`)
*   **State Management:** React Hooks (useState, useEffect), `useLocalStorage` (da `src/hooks/useLocalStorage.ts`) per la persistenza dei dati nel browser.
*   **Backend (per funzionalità IA):** Potenziale uso di Google AI Genkit (come suggerito dalla cartella `src/ai` e dal file `src/ai/genkit.ts`).

## Primi Passi

### Prerequisiti

*   Node.js (versione 18.x o successiva raccomandata)
*   npm (generalmente incluso con Node.js)

### Installazione

1.  Clona il repository (se applicabile) o scarica i file del progetto.
2.  Naviga nella directory principale del progetto:
    ```bash
    cd percorso/del/progetto/MindReboot
    ```
3.  Installa le dipendenze:
    ```bash
    npm install
    ```

### Avviare l'Applicazione (Modalità Sviluppo)

1.  Esegui il seguente comando per avviare il server di sviluppo:
    ```bash
    npm run dev
    ```
    Questo comando avvierà l'app (di default su `http://localhost:3000`, ma nel tuo caso sembra essere configurata per la porta `9002` come da log precedenti).

2.  Apri il tuo browser e vai all'indirizzo indicato nel terminale.

## Sistema di Notifiche

L'applicazione include un sistema di notifiche per supportare l'utente:

*   **Permessi:** L'app richiede il permesso del browser per inviare notifiche.
*   **Tipi di Notifiche:**
    *   **Promemoria Orari:** Se abilitati, possono inviare messaggi a intervalli regolari durante le ore di veglia definite dall'utente.
    *   **Messaggi Motivazionali:** L'app può inviare messaggi motivazionali, scelti da una lista predefinita o personalizzati dall'utente.
*   **Approccio:** Le notifiche sono pensate per essere di supporto e incoraggiamento, piuttosto che restrittive. L'obiettivo è aiutare l'utente a rimanere consapevole e motivato, suggerendo attività positive o momenti di riflessione.
*   **Gestione:** Le impostazioni relative alle notifiche si trovano in `src/app/(app)/settings/page.tsx`.

---

Questo README fornisce una buona panoramica. Puoi espanderlo ulteriormente con dettagli su specifiche funzionalità, decisioni architetturali o guide per i contributori.
