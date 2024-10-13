import Scheduler from '@mormat/react_scheduler';

import { render } from 'react-dom';

const currentDate = "2024-10-08";

const events = [
    { "label": "interview",  "start": "2024-10-08 10:00", "bgColor": "#0288d1" },
    { "label": "conference", "start": "2024-10-09 14:00", "end": "2024-10-09 18:00", "bgColor": "#9575cd" },
    { "label": "meeting", "start": "2024-10-11 09:00", "end": "2024-10-11 18:00", "bgColor": "#0fc4a7" },
    { "label": "training course", "start": "2024-10-08 09:00", "end": "2024-10-11 18:00", "bgColor": "#856404" },
]

render(
    <Scheduler 
        currentDate = { currentDate } 
        events = { events } 
    />, 
    document.getElementById('scheduler')
);
