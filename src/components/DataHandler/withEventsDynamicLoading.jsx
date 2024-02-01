
import { useState, useEffect } from 'react';

import { cleanEvent } from '../../models/events';

import { formatters } from '../../utils/date';

function withEventsDynamicLoading( WrappedComponent, dateRange ) {
    
    return function( { events, schedulerOptions, ...otherProps} ) {
   
        const [loadedEvents, setLoadedEvents] = useState(Array.isArray(events) ? events : []);
        
        const loadEvents = () => {
            if (events instanceof Function) {
                events(
                    (values) => setLoadedEvents(values.map(cleanEvent)),
                    { 
                        start: formatters['yyyy-mm-dd hh:ii'](dateRange.start),
                        end:   formatters['yyyy-mm-dd hh:ii'](dateRange.end)
                    }
                );
            } else {
                setLoadedEvents(events);
            }
        }
        
        const onEventUpdate = (event, previous) => {
            const index = loadedEvents.findIndex(v => v === previous);
            
            if (index > -1) {
                const newEvents = [...loadedEvents];
                newEvents[index] = event;
                setLoadedEvents(newEvents);
            }
            
            schedulerOptions.onEventUpdate(event, previous, loadEvents);
        }
        
        const onEventCreate = (event) => {
            setLoadedEvents([...loadedEvents, event]);
            
            schedulerOptions.onEventCreate(event, null, loadEvents);
        }
        
        const onEventDelete = (event) => {
            setLoadedEvents(loadedEvents.filter(e => e !== event));
            
            schedulerOptions.onEventDelete(event, loadEvents);
        }
        
        useEffect(() => {
            if (events instanceof Function) {
                events(
                    (values) => setLoadedEvents(values.map(cleanEvent)),
                    { 
                        start: formatters['yyyy-mm-dd hh:ii'](dateRange.start),
                        end:   formatters['yyyy-mm-dd hh:ii'](dateRange.end)
                    }
                );
            } else {
                setLoadedEvents(events);
            }
        }, [events]);
           
        return (
            <WrappedComponent 
                { ...otherProps } 
                events           = { loadedEvents }
                schedulerOptions = { {
                    ...schedulerOptions,
                    onEventCreate,
                    onEventUpdate,
                    onEventDelete
                } }
                
            />
        )
        
    }
    
}

export default withEventsDynamicLoading
    