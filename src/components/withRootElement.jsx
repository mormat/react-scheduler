import { useState, useRef, useEffect } from 'react';

function withRootElement(WrappedComponent) {
    
    const [rootElement, setRootElement] = useState();
    
    const wrapperRef = useRef();
    
    useEffect(() => {
        setRootElement(wrapperRef.current.parentNode);
    }, []);
    
    return function({schedulerOptions, ...otherProps}) {
        
        return (
                
            <div ref = { wrapperRef }>
                { rootElement && (
                    <WrappedComponent
                        schedulerOptions = { { rootElement, ...schedulerOptions }}
                        { ...otherProps }
                    />
                ) }
            </div>
        )
    }
    
}

export default withRootElement;