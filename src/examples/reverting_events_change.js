import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

const handleEventUpdate = function(values, { setValues, valuesBefore }) {
    setValues(valuesBefore);
}

const handleEventDelete = function(values, { undoDelete }) {
     undoDelete();
}

const handleEventDrop = function(values, { setValues, valuesBefore }) {
    setValues(valuesBefore);
}

const handleEventResize = function(values, { setValues, valuesBefore }) {
    setValues(valuesBefore);
}

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        onEventUpdate = { handleEventUpdate }
        onEventDelete = { handleEventDelete }
        onEventDrop   = { handleEventDrop }
        onEventResize = { handleEventResize }
        events = { [
           { 
               "some_id": 1234,
               "label": "fixed task",  
               "start": "2024-10-08 10:00" 
           } 
        ] }
        currentDate = "2024-10-08"
    /> 
)
