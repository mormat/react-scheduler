
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
        
        return (
            <WrappedComponent 
                { ...otherProps } 
                schedulerOptions = { {
                    ...schedulerOptions,
                    onEventUpdate
                } }
                events           = { staticEvents }
            />
        )
        
    }
    
}

export default withEventsStaticLoading
    