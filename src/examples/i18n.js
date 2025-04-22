import { createRoot } from 'react-dom/client';
import { 
    Scheduler, 
    DefaultEventForm, 
    withEventForm 
} from '@mormat/react_scheduler';

const SchedulerWithEventForm = withEventForm(Scheduler, DefaultEventForm);

createRoot( document.getElementById('scheduler' ) ).render(
    <SchedulerWithEventForm 
        dateLocale="fr" 
        translations = {{
            "header.today": "Aujourd'hui",
            "header.day":   "jour",
            "header.week":  "semaine",
            "header.month": "mois",
            "form.event_label":   "Nom de l'evenement",
            "form.event_start":   "A partir de",
            "form.event_end":     "Jusqu'a",
            "form.event_bgcolor": "Couleur",
            "form.ok_btn":        "Confirmer",
            "form.cancel_btn":    "Annuler",
            "form.delete_btn":    "Supprimer",
            'msg.confirm_delete': "Supprimer l'evenement '$event_label' ?"
        }}
        events = { 
            [ { "label": "interview",  "start": "2024-10-08 10:00" }, ]
        }
    />
);

