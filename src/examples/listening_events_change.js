import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

const handleEventCreate = function({label, start, end, bgColor}) {
    const json = JSON.stringify({label, start, end, bgColor});
    document.getElementById('comments').innerHTML = `${json} created`;
}

const handleEventUpdate = function({some_id, label, start, end, bgColor}) {
    const json = JSON.stringify({some_id, label, start, end, bgColor});
    document.getElementById('comments').innerHTML = `${json} updated`;
}

const handleEventDelete = function({some_id, label, start, end, bgColor}) {
    const json = JSON.stringify({some_id, label, start, end, bgColor});
    document.getElementById('comments').innerHTML = `${json} deleted`;
}

const handleEventDrop = function({some_id, label, start, end, bgColor}) {
    const json = JSON.stringify({some_id, label, start, end, bgColor});
    document.getElementById('comments').innerHTML = `${json} dropped`;
}

const handleEventResize = function({some_id, label, start, end, bgColor}) {
    const json = JSON.stringify({some_id, label, start, end, bgColor});
    document.getElementById('comments').innerHTML = `${json} resized`;
}

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        onEventCreate = { handleEventCreate }
        onEventUpdate = { handleEventUpdate }
        onEventDelete = { handleEventDelete }
        onEventDrop   = { handleEventDrop }
        onEventResize = { handleEventResize }
        events = { [
           { 
               "some_id": 1234,
               "label": "interview",  
               "start": "2024-10-08 10:00" 
           } 
        ] }
        initialDate = "2024-10-08"
    /> 
)
