import { createRoot } from 'react-dom/client';
import { 
    Scheduler, 
    DefaultEventForm, 
    withEventForm 
} from '@mormat/react_scheduler';

const SchedulerWithEventForm = withEventForm(Scheduler, DefaultEventForm);

const events = [
    { "label": "interview",  "start": "2024-10-08 10:00" },
];

const handleEventUpdate = function(values) {
    document.getElementById('comments').innerHTML = `'${values.label}' event updated`;
}

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        currentDate   = "2024-10-08"
        events        = { events }
        onEventUpdate = { handleEventUpdate }
    /> 
);
