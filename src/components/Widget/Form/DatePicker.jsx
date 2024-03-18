
import { useState, useEffect } from 'react';

import { formatters } from '../../../utils/date'

function DatePicker( { value, onChange, label, disabled = false, ...otherProps } ) {
    
    const defaults = getDefaults(value);
    
    const [year,  setYear]  = useState(defaults.year);
    const [month, setMonth] = useState(defaults.month);
    const [day,   setDay]   = useState(defaults.day);
        
    useEffect(() => {
        const newValue = [year, month, day].join('-');
        if (newValue !== value) {
            onChange(newValue);
        }
    }, [year, month, day]);
    
    const options = buildOptions();
    
    return (
        <span 
            className      = "mormat-scheduler-Widget-Form-DatePicker"
            data-label     = { label }
            data-form-type = "DatePicker"
            { ...otherProps }
        >
            <select
                value    = { day } 
                onChange = { e => setDay(e.target.value)} 
                title     = "day"
                disabled  = { disabled }
            >
            
                { Object.keys(options['days']).toSorted().map((v) => (
                    <option 
                        key      = { v } 
                        value    = { v } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { options['days'][v] }
                    </option>
                )) }
        
            </select>
            &nbsp;
            <select
                value    = { month } 
                onChange = { e => setMonth(e.target.value)} 
                title     = "month"
                disabled  = { disabled }
            >
            
                { Object.keys(options['months']).toSorted().map((v) => (
                    <option 
                        key      = { v } 
                        value    = { v } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { options['months'][v] }
                    </option>
                )) }
        
            </select>
            &nbsp;
            <select
                value    = { year } 
                title    = "year"
                onChange = { e => setYear(e.target.value) }
                disabled = { disabled }
            >
            
                { Object.entries(options['years']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                    >
                        { label }
                    </option>
                )) }
        
            </select>

        </span>
    )
    
}

const buildOptions = () => {

    const today   = new Date(Date.now());

    const days = {}
    for (let i = 1; i <= 31; i++) {
        const key = String(i).padStart(2, '0');
        days[key] = i;
    }
        
    const months = {}
    for (let i = 0; i < 12; i++) {
        const d = new Date(1970, i, 1);
        const label = d.toLocaleString('en', { month: 'long' });
        const key   = String(i + 1).padStart(2, '0');
        months[key] = label;
    }
    
    const years = {}
    const currentYear = today.getFullYear();
    for (let year = currentYear - 9; year <= currentYear; year ++) {
        years[year] = year;
    }
        
    return { days, months, years }
}

const getDefaults = (value) => {
    
    const d = new Date(Date.parse(value) || Date.now());
    
    return {
        year:  formatters['yyyy'](d),
        month: formatters['mm'](d),
        day:   formatters['dd'](d),
    }
}

export default DatePicker
    