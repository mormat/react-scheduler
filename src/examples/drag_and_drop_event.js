import { createRoot } from 'react-dom/client';
import { Scheduler } from '@mormat/react_scheduler';

function App() {
    
    const events = [
        { "label": "moveable",       "start": "2024-10-08 09:00", "end": "2024-10-08 12:00" },
        { "label": "fixed position", "start": "2024-10-10 09:00", "end": "2024-10-10 12:00" },
    ]

    const handleDrop = function(schedulerEvent, { revert }) {
        if (schedulerEvent.label.includes("fixed position")) {
            revert();
        }
    }

    return ( 
        <Scheduler 
            currentDate = "2024-10-08"
            events = { events } 
            onEventDrop = { handleDrop } 
        /> 
    );
    
}

createRoot( document.getElementById('scheduler' ) ).render( <App /> );
