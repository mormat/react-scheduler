import { createRoot } from 'react-dom/client';
import Scheduler from '@mormat/react_scheduler';

createRoot( document.getElementById('scheduler' ) ).render(
    <Scheduler 
        dateLocale="fr" 
        translations = {{
            "header.today": "Aujourd'hui",
            "header.day":   "jour",
            "header.week":  "semaine",
            "header.month": "mois"
        }}
    />
);

