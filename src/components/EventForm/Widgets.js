
import { useEffect, useState, useContext } from 'react';
import { utils } from '@mormat/jscheduler_ui';

import { InputPropsContext } from './Contexts';

function Input({ value, setValue, ...otherProps }) {
    
    const inputProps = useContext(InputPropsContext);
    
    return (
        <input 
            value    = { value }
            onChange = { e => setValue(e.target.value) }
            { ...otherProps }
            { ...inputProps }
        />
    );
    
}

function Button( { children, variant, type = 'button', ...otherProps } ) {
    
    return (
        <button 
            className="mormat-scheduler-Button"
            data-variant = { variant } 
            type = { type }
            { ...otherProps } 
        >
            { children }
        </button>        
    )
    
}

function Message( { children, variant, ...otherProps } ) {
    return (
        <span
            className="mormat-scheduler-Message"
            data-variant = { variant }
            { ...otherProps }
        >
            { children }
        </span>
    )
}

function ColorPicker( { value, setValue })
{
    const colors = [
        '#0288d1', 
        '#9575cd', 
        '#0fc4a7', 
        '#721c24', 
        '#856404', 
        '#383d41'
    ];
    
    useEffect(() => {
        if (!colors.includes(value)) {
            setValue(colors[0]);
        }
    }, []);

    return (
        <span className="mormat-scheduler-ColorPicker">
             { colors.map((v) => (
                <label  key = { v } 
                        data-label = { v }
                        style = { { 
                            borderColor: v === value ? v : 'transparent'
                        } }
                        onMouseDown = { e => e.preventDefault() }
                >
                    <span style = { { backgroundColor: v } }>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <input  
                        type       = "radio" 
                        value      = { v } 
                        checked    = { value === v }
                        onChange   = { e => setValue(e.target.value) }
                    />
                    <span style = {{ display: 'none'}}>
                        { v }
                    </span>
                </label>
                
            )) }
        </span>
    )
}

function DateTimePicker( { value, setValue, dateLocale = 'en', ...otherProps }) {
    
    const options = buildDateTimeOptions( { dateLocale });
    
    // @todo useState may not be needed as the value as controlled by the parent
    const [values, setValues] = useState(() => {
        
        let time  = utils.format_date('hh:ii', value);
        const day = utils.format_date('dd', value);
        const month = utils.format_date('mm', value);
        const year = utils.format_date('yyyy', value);
        
        for (const v of options['times']) {
            if (v >= time) {
                time = v;
                break;
            }
        }
        
        return { time, day, month, year }
    });
    
    function updateValue(name, value) {
        const newValues = { ...values }
        newValues[name] = value;
        setValues(newValues);
        
        const { year, day, month, time } = newValues;
        setValue(`${year}-${month}-${day} ${time}`);
        
    };
    
    return (
        <span className="mormat-scheduler-DateTimePicker">
        
            <select
                title = "time"
                value = { values['time'] }
                onChange = { e => updateValue('time', e.target.value) }
            >
                { options['times'].map( time => (
                    <option
                        key = { time }
                        value = { time }
                        title = { time }
                    >   
                     { time }
                    </option>
                )) }
            </select>
            &nbsp; 
            <select
                title = "day"
                value = { values['day'] }
                onChange = { e => updateValue('day', e.target.value) }
            >
                { Object.keys(options['days']).toSorted().map((v) => (
                    <option 
                        key      = { v } 
                        value    = { v } 
                        title    = { options['days'][v] }
                    >
                        { options['days'][v] }
                    </option>
                )) }
            </select>
            &nbsp;
            <select
                title  = "month"
                value  = { values['month'] }
                onChange = { e => updateValue('month', e.target.value) }
            >            
                { Object.keys(options['months']).toSorted().map((v) => (
                    <option 
                        key      = { v } 
                        value    = { v } 
                        title    = { options['months'][v] }
                    >
                        { options['months'][v] }
                    </option>
                )) }
        
            </select>
            &nbsp;
            <select
                title = "year"
                value = { values['year'] }
                onChange = { e => updateValue('year', e.target.value) }
            >            
                { Object.entries(options['years']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                        title    = { label }
                    >
                        { label }
                    </option>
                )) }
            </select>

        </span>
    )
    
}

function buildDateTimeOptions({ minutesStep = 5, dateLocale = 'en' } = {}) {
    
    const today   = new Date(Date.now());
    
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute = minute + minutesStep) {
            const time = utils.format_date('hh:ii', `1970-01-01 ${hour}:${minute}`);
            times.push(time);
        }
    }
    
    const days = {}
    for (let i = 1; i <= 31; i++) {
        const key = String(i).padStart(2, '0');
        days[key] = i;
    }
    
    const months = {}
    for (let i = 0; i < 12; i++) {
        const d = new Date(1970, i, 1);
        const label = d.toLocaleString(dateLocale, { month: 'long' });
        const key   = String(i + 1).padStart(2, '0');
        months[key] = label;
    }
    
    const years = {}
    const currentYear = today.getFullYear();
    for (let year = currentYear - 9; year <= currentYear; year ++) {
        years[year] = year;
    }
    
    return { times, days, months, years };
}

export {
    Input,
    Button,
    Message,
    ColorPicker,
    DateTimePicker
}

