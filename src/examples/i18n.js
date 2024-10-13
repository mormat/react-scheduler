import { render } from 'react-dom';
import Scheduler from '@mormat/react_scheduler';

render(
    <Scheduler 
        dateLocale="fr" 
        translations = {{
            "header.today": "Aujourd'hui",
            "header.day":   "jour",
            "header.week":  "semaine",
            "header.month": "mois"
        }}
    />, 
    document.getElementById('scheduler')
);



