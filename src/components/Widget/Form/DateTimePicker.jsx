
import { useState, useEffect } from 'react';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

import { format_date } from '../../../utils/date';

function DateTimePicker( { value, label, onChange, name, decorators = {} } ) {

    const defaults = getDefaults(value);

    const [time, setTime] = useState(defaults.time);
    const [date, setDate] = useState(defaults.date);

    useEffect(() => {
        const newValue = date + ' ' + time;
        if (newValue !== value) {
            onChange(newValue);
        }
    }, [date, time]);
    
    
    const decorates = (type, subject) => {
        return decorators[type] ? decorators[type](subject, name) : subject;
    }
    
    return (
        <span className  = "mormat-scheduler-Widget-Form-DateTimePicker"
              data-label     = { label }
              data-form-type = "DateTimePicker"
        >
            { decorates('label', (
                <label>{ label }</label>
            )) }
        
            <TimePicker 
                value    = { time }
                onChange = { setTime }
            />
            &nbsp;
            <DatePicker 
                value    = { date }
                onChange = { setDate }
            />
        </span>
    )
    
}

function withFormatter(Component) {
    
    return function({value, onChange, ...otherProps})
    {
        return (
            <Component 
                value    = { format_date('yyyy-mm-dd hh:ii', value) }
                onChange = { v => onChange(new Date(v)) }
                { ...otherProps }
            />
        )
    }
    
}

function getDefaults(value) {
    const parts = (value || '').split(' ');
    
    return { date: parts[0], time: parts[1] }
}

export default withFormatter(DateTimePicker);
    
export { DateTimePicker }
    
    