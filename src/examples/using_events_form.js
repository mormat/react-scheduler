import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        events = { [
           { 
               "some_id": 1234,
               "label": "interview",  
               "start": "2024-10-08 10:00" 
           } 
        ] }
    /> 
)
