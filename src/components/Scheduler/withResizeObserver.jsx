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
        
        const getMaxWidth = () => {
            const widths = [0, 320, 480, 640, 1280];
            for (let i = 0; i < widths.length - 1; i++) {
                if (widths[i] <= size.width && size.width < widths[i+1]) {
                    return widths[i + 1];
                }
            }
        }
        
        return (
            <div 
                className = "mormat-scheduler-Scheduler-withResizeObserver"
                style = { { 
                    ...calcStyle(schedulerOptions),
                    ...size
                } }
                data-max-width = { getMaxWidth() }
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