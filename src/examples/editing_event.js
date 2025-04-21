import { createRoot } from 'react-dom/client';
import { Scheduler, EventForm } from '@mormat/react_scheduler';
import { useState, useMemo } from 'react';

function App() {
    
    const [schedulerEvent, setSchedulerEvent] = useState();
    
    const scheduler = useMemo(() => {
        
        const events = [
            { "label": "interview",  "start": "2024-10-08 10:00" },
        ]
        
        const handleEventEdit = function(schedulerEvent) {
            setSchedulerEvent(schedulerEvent);
        }
        
        return ( 
            <Scheduler 
                currentDate = "2024-10-08"
                events = { events } 
                onEventEdit = { handleEventEdit } 
            /> 
        );
        
    }, [setSchedulerEvent]);

    return <>
        { scheduler }
        { schedulerEvent && (
            <EventForm 
                values = { schedulerEvent.values }
                onConfirm = { (values) => {
                    schedulerEvent.update(values);
                    setSchedulerEvent(null);
                }}
                onCancel = { () => {
                    setSchedulerEvent(null);
                }}
                
            />
        ) }
    </>;
}

createRoot( document.getElementById('scheduler' ) ).render( <App /> );
