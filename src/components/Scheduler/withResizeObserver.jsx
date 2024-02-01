import { useState, useEffect } from 'react';

function withResizeObserver(WrappedComponent) {

    function isObservable({ width, height }) {
        return width === 'auto' || height === 'auto';
    }
    
    function calcSize({ rootElement, width, height }) {
        return {
            width:  width  === 'auto' ? rootElement.clientWidth:  width,
            height: height === 'auto' ? rootElement.clientHeight: height,
        }
    }
    
    function calcStyle({ height }) {
        const style = {}
        
        if (height === 'auto') {
            style['position'] = 'absolute';
            style['left']    = 0;
            style['top']     = 0;
        } else {
            style['position'] = 'relative';
        }
        
        return style;
    }
    
    return function({schedulerOptions, ...otherProps}) {
        
        const [size, setSize] = useState(calcSize(schedulerOptions));
        
        useEffect(() => {
            
            const resize = () => setSize(calcSize(schedulerOptions));
            
            if (isObservable(schedulerOptions)) {
                window.addEventListener('resize', resize);
                
                return () => window.removeEventListener('resize', resize);
            }
            
        }, []);
        
        return (
            <div 
                className = "mormat-scheduler-Scheduler-withResizeObserver"
                style = { { 
                    ...calcStyle(schedulerOptions),
                    ...size
                } }
            >
                <WrappedComponent
                    schedulerOptions = { { ...schedulerOptions, ...size }}
                    { ...otherProps }
                />
            </div>
        )
    }
    
}

export default withResizeObserver;