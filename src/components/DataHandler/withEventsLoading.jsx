
import { useState, useEffect } from 'react';

import { formatters } from '../../utils/date';

import withSchedulerEvents from './withSchedulerEvents';

function withEventsLoading( WrappedComponent, dateRange ) {
    
    return function( { events, ...otherProps} ) {
   
        const [loadedEvents, setLoadedEvents] = useState(
            Array.isArray(events) ? events : []
        );
        
        const reset = () => {
            if (events instanceof Function) {
                events(
                    (values) => setLoadedEvents(values),
                    { 
                        start: formatters['yyyy-mm-dd hh:ii'](dateRange.start),
                        end:   formatters['yyyy-mm-dd hh:ii'](dateRange.end)
                    }
                );
            }
        }
                
        useEffect(() => {
            reset();
        }, [events]);
        
        const Component = withSchedulerEvents(WrappedComponent);
           
        return (
            <Component 
                { ...otherProps } 
                events = { loadedEvents }
            />
        )
        
    }
    
}

export default withEventsLoading
    