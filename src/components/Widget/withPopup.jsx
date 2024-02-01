
import { useState, useEffect, useRef } from 'react';

import XCircleIcon from './XCircleIcon';

function withPopup( WrappedComponent, onClose ) {
    
    const handleClose = e => {
        e.preventDefault();
        onClose();
    }
    
    return function( { ...otherProps} ) {
   
        const bodyRef = useRef();
        
        const [bodyStyle, setBodyStyle] = useState({});
        
        useEffect(() => {
            const { width, height } = bodyRef.current.getBoundingClientRect();
            
            setBodyStyle({
                marginTop: (- height / 2) + 'px',
                marginLeft: ( - width / 2 ) + 'px',
                opacity: 1,
            })
        }, []);
   
        return (
                
            <div className="mormat-scheduler-Widget-withPopup" >
    
                <div data-role="overlay"></div>
    
                <div data-role="body" ref = { bodyRef } style = { bodyStyle }>
                
                    <div data-role="close" onClick = { handleClose }>
                        <XCircleIcon />
                    </div>
                
                    <WrappedComponent { ...otherProps } />
                </div>

            </div>
        )
        
    }
    
}

export default withPopup
    