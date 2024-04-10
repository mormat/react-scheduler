import { useState, useRef, useEffect } from 'react';

import { useUniqueId } from '../utils/dom'

function withRootElement(WrappedComponent) {
    
    return function({schedulerOptions, ...otherProps}) {
        
        const id = useUniqueId();
        
        let height = schedulerOptions.height;
        if (height === 'auto') {
            height = '-webkit-fill-available';
        }
        
        return (
              
            <WrappedComponent
                schedulerOptions = { { ...schedulerOptions, id, height} }
                { ...otherProps }
            />
                
        )
    }
    
}

export default withRootElement;