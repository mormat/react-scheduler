import { render } from 'react-dom';
import { Scheduler, EventForm } from '@mormat/react_scheduler';
import { useState, useMemo } from 'react';

function App() {
    
    const [schedulerEvent, setSchedulerEvent] = useState();
    
    const scheduler = useMemo(() => {
        
        const handleEventAdd = function(schedulerEvent) {
            setSchedulerEvent(schedulerEvent);
        }
        
        return ( <Scheduler onEventAdd = { handleEventAdd } /> );
        
    }, [setSchedulerEvent]);

    return <>
        { scheduler }
        { schedulerEvent && (
            <EventForm 
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


render(<App />, document.getElementById('scheduler'));