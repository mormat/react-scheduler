import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

let lastId = 1234;

const handleEventCreate = function(values, { setValues }) {
    setValues( {
        custom_id: lastId++, // normally should be some generated value
    });
}

const handleEventUpdate = function({custom_id}) {
    document.getElementById('comments').innerHTML = `Event #${custom_id} updated`;
}

const handleEventDelete = function({custom_id}) {
    document.getElementById('comments').innerHTML = `Event #${custom_id} deleted`;
}

const handleEventDrop = function({custom_id}) {
    document.getElementById('comments').innerHTML = `Event #${custom_id} dropped`;
}

const handleEventResize = function({custom_id}) {
    document.getElementById('comments').innerHTML = `Event #${custom_id} resized`;
}

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        onEventCreate = { handleEventCreate }
        onEventUpdate = { handleEventUpdate }
        onEventDelete = { handleEventDelete }
        onEventDrop   = { handleEventDrop }
        onEventResize = { handleEventResize }
    /> 
)
