import { useEffect, useRef } from 'react';

import withEventAdd  from './withEventAdd';
import withEventEdit from './withEventEdit';

function withRootElement( WrappedComponent ) {
    
    return function( props ) {
    
        let DecoratedComponent = WrappedComponent;
        if (props.onEventAdd) {
            DecoratedComponent = withEventAdd(DecoratedComponent);
        }
        if (props.onEventEdit) {
            DecoratedComponent = withEventEdit(DecoratedComponent);
        }
        
        const style = {
            position: 'relative', 
            minHeight: '480px', 
            height: '100%'
        }
        
        return (
            <div className="mormat-scheduler" style = { style } >
                <DecoratedComponent 
                    { ...props } 
                    eventsDraggable  = { props.onEventDrop }
                    eventsResizeable = { props.onEventResize }
                />
            </div>
        );
        
    }
    
}

export default withRootElement