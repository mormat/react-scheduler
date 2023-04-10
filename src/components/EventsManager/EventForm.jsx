
import { useState, useEffect } from 'react';

import DateTimeInput from '../Widget/DateTimeInput';

function EventForm( { schedulerEvent, onConfirm } ) {
    
    const [label,   setLabel]   = useState('');
    const [start,   setStart]   = useState(new Date());
    const [end,     setEnd]     = useState(new Date());
    // const [bgColor, setBgColor] = useState('');
    
    useEffect( () => {
        
        setLabel(schedulerEvent.label || '');
        setStart(schedulerEvent.start || new Date());
        setEnd(schedulerEvent.end     || new Date());
        // setBgColor(schedulerEvent.bgColor || '');
        
    }, [schedulerEvent]);
    
    const handleConfirm = (e) => {
        e.preventDefault();
        
        const newValues = {
            ...schedulerEvent, label, start, end //, bgColor
        }
        
        onConfirm(newValues, schedulerEvent);
    }
    
    return (
        <form className="mormat-scheduler-EventsManager-EventForm" >
            <p> 
                <label>
                    Description
                    <br/>
                    <input 
                        name     = "label"
                        type     = "text" 
                        value    = { label }
                        onChange = { e => setLabel(e.target.value) }
                    />
                </label>
            </p>
            <p> 
                <label>
                    From
                    <br/>
                    <DateTimeInput 
                        name     = "start"
                        value    = { start } 
                        onChange = { setStart } 
                    />
                </label>
            </p>
            <p> 
                <label>
                    To
                    <br/>
                    <DateTimeInput 
                        name     = "end"
                        value    = { end } 
                        onChange = { setEnd } 
                    />
                </label>
            </p>
            { /*
            <p> 
                <label>
                    Color
                    <br/>
                    <input 
                        name = "bgColor"
                        type = "text" 
                    />
                </label>
            </p>
            */ }
            <p>
                <button onClick = { handleConfirm } >
                    Ok
                </button>
            </p>
        </form>
    )
    
}

export default EventForm
    