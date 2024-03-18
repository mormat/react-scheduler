
import { useState, useEffect } from 'react';

import { format_date } from '../../../utils/date'

function TimePicker( { value, onChange, label, minutesStep = 5, ...otherProps } ) {
    
    const options = getOptions(minutesStep);
    
    const [time, setTime] = useState(() => {
        const current = value ? value : format_date('hh:ii', Date.now());
        
        const  values = Object.values(options);
        return values.filter(v => v <= current).at(-1);
    });
    
    useEffect(() => {
        if (time !== value) {
            onChange(time)
        }
    }, [time])
    
    return (
        <span 
            className      = "mormat-scheduler-Widget-TimePicker"
            data-label     = { label }
            data-form-type = "DateTimePicker"
            { ...otherProps }
        >
        
            <select 
                value    = { time } 
                onChange = { e => setTime(e.target.value)} 
                title     = "time"
            >
                { Object.entries(options).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                    >
                        { value }
                    </option>
                )) }

            </select>
        </span>
    )
    
}

function getOptions(minutesStep) {
    const options = {};
    
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute = minute + minutesStep) {
            const time = format_date('hh:ii', `1970-01-01 ${hour}:${minute}`);
            options[time] = time;
        }
    }
    
    return options;
}

export default TimePicker
    