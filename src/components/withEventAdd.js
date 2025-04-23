import { useRef } from 'react';

import { instances } from './Scheduler';

function withEventAdd( WrappedComponent ) {
    
    return function( { onEventAdd, ...otherProps } ) {
        
        const { translations = {} } = otherProps;
        
        const refParent = useRef();
        
        const handleEventAdd = (e) => {
            const scheduler = instances.get(
                refParent.current.querySelector('[data-scheduler]')
            );
            const newEvent = {}
            onEventAdd( newEvent, scheduler );
        }
        
        return (
            <div ref = { refParent }
                 className="mormat-scheduler-withEventAdd" 
                 style= {{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <WrappedComponent { ...otherProps } />
                        
                { onEventAdd && (
                    <a onClick = { handleEventAdd }
                       title={ translations['add_event_btn'] || "Add event" }>
                        { plusIcon }
                    </a>
                ) }
                
            </div>
        );
        
    }
    
}

const plusIcon = (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width  = "24"
        height = "24"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="feather feather-plus">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>        
)

export default withEventAdd