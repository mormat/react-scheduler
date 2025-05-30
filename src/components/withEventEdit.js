import { useRef } from 'react';

import { instances } from './Scheduler';

function withEventEdit( WrappedComponent ) {
    
    return function( { onEventEdit, ...otherProps } ) {
        
        const refParent = useRef();
        
        const handleEventEdit = (schedulerEvent) => {
            const scheduler = instances.get(
                refParent.current.querySelector('[data-scheduler]')
            );
            onEventEdit( schedulerEvent, scheduler );
        }
        
        return (
            <div ref = { refParent }>
                <WrappedComponent { ...otherProps } 
                    onEventEdit = { handleEventEdit }
                    eventsEditable = { true }
                />
            </div>
        );
        
    }
    
}

export default withEventEdit