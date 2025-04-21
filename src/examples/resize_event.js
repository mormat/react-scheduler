import { createRoot } from 'react-dom/client';
import { Scheduler } from '@mormat/react_scheduler';

function App() {
    
    const events = [
        { "label": "resizeable",   "start": "2024-10-08 09:00", "end": "2024-10-08 12:00" },
        { "label": "fixed height", "start": "2024-10-10 09:00", "end": "2024-10-10 12:00" },
    ]

    const handleResize = function(schedulerEvent, valuesBefore) {
        if (schedulerEvent.label.includes("fixed height")) {
            schedulerEvent.update(valuesBefore);
        }
    }

    return (
        <Scheduler 
            currentDate = "2024-10-08"
            events = { events } 
            onEventResize = { handleResize } 
        />
    );
}

createRoot( document.getElementById('scheduler' ) ).render( <App /> );
