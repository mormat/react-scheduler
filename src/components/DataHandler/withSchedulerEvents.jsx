
import { useState, useEffect } from 'react';

import { createSchedulerEvent } from '../../models/events';
import { format_date } from '../../utils/date';

/**
 * Convert every event in the schedulerOptions to a SchedulerEvent instance
 */
function withSchedulerEvents( WrappedComponent ) {
    
    return function( { events, schedulerOptions, ...otherProps} ) {
   
        const getInitialEvents = () => (events || []).map(
            rawEvent => createSchedulerEvent(rawEvent, schedulerOptions)
        );
    
        const [schedulerEvents, setSchedulerEvents] = useState(getInitialEvents());
        
        const reset = () => setSchedulerEvents(getInitialEvents());
        
        const onEventCreate = (rawEvent, options = {}) => {
            
            const schedulerEvent = createSchedulerEvent(rawEvent, schedulerOptions);
            
            setSchedulerEvents([...schedulerEvents, schedulerEvent]);
            
            schedulerOptions.onEventCreate(schedulerEvent, { ...options, reset });
            
        }
        
        const onEventUpdate = (rawEvent, options = {}) => {
            
            const schedulerEvent = createSchedulerEvent(rawEvent, schedulerOptions);
            
            setSchedulerEvents(schedulerEvents.map(function(v) {
                return v.equals(schedulerEvent) ? schedulerEvent : v;
            }));
                
            schedulerOptions.onEventUpdate(schedulerEvent, { ...options, reset });
            
        }
        
        const onEventDelete = (rawEvent, options = {}) => {
            
            const schedulerEvent = createSchedulerEvent(rawEvent, schedulerOptions);
            
            setSchedulerEvents(schedulerEvents.filter(function(v) {
                return !v.equals(schedulerEvent);
            }));
            
            schedulerOptions.onEventDelete(schedulerEvent, { ...options, reset });
            
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
                events = { schedulerEvents }
            />
        )
        
    }
    
}

export default withSchedulerEvents
    