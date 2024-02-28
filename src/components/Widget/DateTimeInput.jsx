
import { useState, useEffect } from 'react';

import { formatters } from '../../utils/date'

const MINUTES_STEP = 5;

function DateTimeInput( { value, onChange, minHour = 0, maxHour = 24, ...otherProps } ) {
    
    const options = buildOptions(minHour, maxHour);
        
    const [day,   setDay]   = useState(value.getDate());
    const [month, setMonth] = useState(value.getMonth());
    const [year,  setYear]  = useState(value.getFullYear());
    const [time,  setTime]  = useState(() => {
        const  time   = formatters['hh:ii'](value);
        const  values = Object.values(options['times']);
        return values.filter(v => v <= time).at(-1);
    });
    
    useEffect(() => {
        const [hour, minute] = time ? time.split(':') : [0, 0];
        
        const newDate = new Date(value);
        newDate.setYear(year);
        newDate.setMonth(month);
        newDate.setDate(day);
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        
        const values = [newDate, value].map(formatters['yyyy-mm-dd hh:ii']);
        if (values[0] !== values[1]) {
            onChange(newDate);
        }
    }, [day, month, year, time]);
    
    return (
        <span 
            className="mormat-scheduler-Widget-DateTimeInput"
            { ...otherProps }
        >

            <select 
                id = { otherProps.id }
                value    = { time } 
                onChange = { e => setTime(e.target.value)} 
                title     = "time"
            >

                { Object.entries(options['times']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { value }
                    </option>
                )) }

            </select>
            &nbsp;
            <select
                value    = { day } 
                onChange = { e => setDay(e.target.value)} 
                title     = "day"
            >
            
                { Object.entries(options['days']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { label }
                    </option>
                )) }
        
            </select>
            &nbsp;
            <select
                value    = { month } 
                onChange = { e => setMonth(e.target.value)} 
                title     = "month"
            >
            
                { Object.entries(options['months']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { label }
                    </option>
                )) }
        
            </select>
            &nbsp;
            <select
                value    = { year } 
                onChange = { e => setYear(e.target.value)} 
                title = "year"
            >
            
                { Object.entries(options['years']).map(([value, label]) => (
                    <option 
                        key      = { value } 
                        value    = { value } 
                        onChange = { e => setDay(e.target.value) }
                    >
                        { label }
                    </option>
                )) }
        
            </select>

        </span>
    )
    
}

const buildOptions = (minHour, maxHour) => {

    const today   = new Date(Date.now());

    const days = {}
    for (let i = 1; i <= 31; i++) {
        days[i] = i;
    }
        
    const months = {}
    for (let i = 0; i < 12; i++) {
        const d = new Date(1970, i, 1);
        const month = d.toLocaleString('en', { month: 'long' });
        months[i] = month;
    }
    
    const years = {}
    const currentYear = today.getFullYear();
    for (let year = currentYear - 9; year <= currentYear; year ++) {
        years[year] = year;
    }
    
    const times = {};
    for (let hour = minHour; hour < maxHour; hour++) {
        for (let minute = 0; minute < 60; minute = minute + MINUTES_STEP) {
            const d = new Date(`1970-01-01 ${hour}:${minute}`);
            const time = formatters['hh:ii'](d);
            times[time] = time;
        }
    }
    
    return { days, months, years, times }
}

export default DateTimeInput
    