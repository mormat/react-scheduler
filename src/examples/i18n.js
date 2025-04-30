import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

createRoot( document.getElementById('scheduler' ) ).render(
    <SchedulerWithEventForm 
        dateLocale="fr" 
        translations = {{
            "header.today":        "Aujourd'hui",
            "header.day":          "jour",
            "header.week":          "semaine",
            "header.month":        "mois",
            "event_desc_label":    "Nom de l'evenement",
            "event_start_label":   "A partir de",
            "event_end_label":     "Jusqu'a",
            "event_bgcolor_label": "Couleur",
            "ok_btn":              "Confirmer",
            "cancel_btn":          "Annuler",
            "delete_btn":          "Supprimer",
            "add_event_btn":       "Ajouter un evenement",
            "edit_event_btn":      "Modifier l'evenement",
            'delete_event_confirm_msg': "Supprimer l'evenement '%event_label%' ?"
        }}
        events = { 
            [ { "label": "interview",  "start": "2024-10-08 10:00" }, ]
        }
    />
);

