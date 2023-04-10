import { useEffect, useState, Fragment } from 'react';

import { getEventRect } from '../../misc/layouts'

import constants from '../../constants';

function DailyColumnsEvent( { value, columnsLayout, dragHandler, onEventUpdate, eventOffset } ) {
        
    const [rect,   setRect]  = useState(null);
    const [range,  setRange] = useState({start: value.start, end: value.end});
    const [draggingState, setDraggingState] = useState(''); // @todo rename to dragInfos ?
    
    const draggable = dragHandler !== null;
    
    const nbrDays = value.end.getDate() - value.start.getDate() + 1;
    
    useEffect(() => {

        refreshRect();

        if (columnsLayout) {
        
            const { element } = columnsLayout;

            element.addEventListener('react-scheduler_resize', refreshRect);
        
            return () => {
                element.removeEventListener('react-scheduler_resize', refreshRect);
            }
        
        }
    
    }, [columnsLayout, value]);
    
    const refreshRect = () => {
        
        let rect = null;
        
        if (columnsLayout) {
            rect = getEventRect(columnsLayout.element, value, eventOffset);
        }
        
        setRect(rect);
        
    }
    
    const getMainClasses = () => {
        let classes = [];
        if (draggable) {
            classes.push('moveable-scheduler-event');
        }
        if (['press', 'move'].includes(draggingState)) {
            classes.push('moving-scheduler-event');
            /* if (isOverlapping()) {
                classes.push('forbidden');
            } */
        }
        
        return classes.join(' ');
    }
    
    const getResizeHandlerClasses = () => {
        let classes = [];
        if (draggable) {
            classes.push('resizable-scheduler-event');
        }
        if (['press', 'move'].includes(draggingState)) {
            classes.push('resizing-scheduler-event');
            /* if (isOverlapping()) {
                classes.push('forbidden');
            }*/
        }
        return classes.join(' ');
    }
    
    const handleMouseDown = (e, behavior) => {
        
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== 0) {
            return;
        }
        
        const subject  = value;
        const listener = () => refreshRect();
        
        if (dragHandler) {
            dragHandler.press(e, subject, { behavior, listener });
            setDraggingState("press");
            
            const mousemove = (e) => {
                dragHandler.move(e, subject, { behavior, listener });
                setDraggingState("move");
            }
            const mouseup = (e) => {
                dragHandler.release(e, subject, { behavior, listener });
                setDraggingState("release");

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup',   mouseup);
            }

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup',   mouseup);
            
        }
        
    }
    
    useEffect(() => {
        if (draggingState === 'release' && onEventUpdate) {
            onEventUpdate(value)    
        }
        
    }, [draggingState]);
       
    let { label, bgColor, color } = value;
    
    bgColor = bgColor || constants.EVENT_DEFAULT_BG_COLOR;
    color = color || constants.EVENT_DEFAULT_COLOR;
    
    if (rect === null) {
        return (<div/>);        
    }
    
    return (
        <div className="mormat-scheduler-Scheduler-DailyColumnsEvent">
            <div className  = { "mormat-scheduler-event " + getMainClasses() }
                 onMouseDown = { e => handleMouseDown(e, 'moving') }
                 style       = { { ...rect, backgroundColor: bgColor, color, position: "absolute" } }
            >
                { nbrDays === 1 && (
                    <div className="scheduler-event-header">
                        { formatTime(value.start) + ' - ' +formatTime(value.end) }
                    </div>
                ) }
                <div className="scheduler-event-body">
                    { label }
                </div>
                { nbrDays === 1 && (
                    <div aria-label="resize event"  
                         className = { "react-scheduler-resize-event " + getResizeHandlerClasses() }
                         onMouseDown = { e => handleMouseDown(e, 'resizing') }
                         style = {{ position: 'absolute', width: '100%', height: '10px', bottom: 0 }}
                    >
                    </div>
                ) }
            </div>
        </div>
    )
    
}

// @todo need a function for this ?
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString().substring(0, 5);
}

export default DailyColumnsEvent
    