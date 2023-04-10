
import { useState, useEffect } from 'react';

import EventForm  from './EventsManager/EventForm';
import EventsList from './EventsManager/EventsList';

let lastUniqueId = 1;

function EventsManager( config ) {
    
    const [internalEvents, setInternalEvents] = useState([]);
    
    const [selectedEvent, setSelectedEvent] = useState({});
    
    useEffect(() => {
        setInternalEvents(config.events);
    }, []);
    
    useEffect(() => {
        setInternalEvents(config.events);
    }, [config])
    
    const onConfirmEvent = (schedulerEvent, previousValue) => {
        
        const newEvents = [...internalEvents];
        
        const index = internalEvents.indexOf(previousValue);
        if (index === -1) {
            schedulerEvent.id = 'new_' + lastUniqueId++;
            newEvents.push(schedulerEvent);
            config.onEventCreate(schedulerEvent);
        } else {
            newEvents[index] = schedulerEvent;
            config.onEventUpdate(schedulerEvent)
        }
        
        setInternalEvents(newEvents);
        
        setSelectedEvent(schedulerEvent);
    }
    
    const onEventDelete = (schedulerEvent) => {
        
        setInternalEvents(internalEvents.filter(f => f!== schedulerEvent));
        config.onEventDelete(schedulerEvent);
        
        setSelectedEvent({});
    }
    
    const handleClickNewEvent = e => {
        e.preventDefault();
        
        setSelectedEvent({});
    }
    
    return (
        <div className="mormat-scheduler-EventsManager">
        
            <div>
            
                { internalEvents.length === 0 && (
                    <span>No events defined yet</span>
                ) }
    
                { internalEvents.length > 0 && (
                    <EventsList 
                        events = { internalEvents } 
                        selectedEvent = { selectedEvent }
                        onEventSelect = { setSelectedEvent }
                        onEventDelete = { onEventDelete}
                    />
                ) }
        
                <p>
                    <button onClick = { handleClickNewEvent }>
                        Add event
                    </button>
                </p>
                
            </div>
        
            <hr/>
        
            <div>
        
                <EventForm 
                    schedulerEvent = { selectedEvent }
                    onConfirm      = { onConfirmEvent } 
                    
                />
            
            </div>
            
        </div>
        
    )
    
}

export default EventsManager
    