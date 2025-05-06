import { createRoot } from 'react-dom/client';
import { Scheduler } from '@mormat/react_scheduler';

function App() {
    
    const events = [
        { "label": "moveable",       "start": "2024-10-08 09:00", "end": "2024-10-08 12:00" },
    ]

    return ( 
        <Scheduler 
            initialDate = "2024-10-08"
            events = { events } 
            onEventDrop = { () => {} } 
        /> 
    );
    
}

createRoot( document.getElementById('scheduler' ) ).render( <App /> );
