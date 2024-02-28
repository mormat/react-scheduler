
import { useState, useEffect } from 'react';

import { cleanEvent } from '../../models/events';

function withEventsStaticLoading( WrappedComponent ) {
    
    return function( { events, schedulerOptions, ...otherProps} ) {
   
        const [staticEvents, setStaticEvents] = useState(events.map(cleanEvent));
        
        const onEventUpdate = (event, previous) => {
            
            const index = staticEvents.findIndex(v => v === previous);
            if (index > -1) {
                const newEvents = [...staticEvents];
                newEvents[index] = event;
                setStaticEvents(newEvents);
            }
            
            schedulerOptions.onEventUpdate(event, previous);

        }
        
        const onEventCreate = (event, ...others) => {
            staticEvents.push(event);
            schedulerOptions.onEventCreate(event, ...others);
        }
        
        const onEventDelete = (event, ...others) => {
            setStaticEvents(staticEvents.filter(e => e !== event));
            schedulerOptions.onEventDelete(event, ...others);
        }
        
        return (
            <WrappedComponent 
                { ...otherProps } 
                schedulerOptions = { {
                    ...schedulerOptions,
                    onEventCreate,
                    onEventUpdate,
                    onEventDelete
                } }
                events           = { staticEvents }
            />
        )
        
    }
    
}

export default withEventsStaticLoading
    