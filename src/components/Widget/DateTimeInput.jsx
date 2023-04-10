
import { useState, useEffect } from 'react';

const today   = new Date(Date.now());

const MINUTES_STEP = 5;

function DateTimeInput( { value, onChange, name = '', minHour = 7, maxHour = 21, ...otherProps } ) {
    
    const options = buildOptions(minHour, maxHour);

    const [day,   setDay]   = useState(1);
    const [month, setMonth] = useState(1);
    const [year,  setYear]  = useState(1970);
    const [time,  setTime]  = useState('00:00');
    
    useEffect(() => {
        setDay(value.getDate());
        setMonth(value.getMonth());
        setYear(value.getFullYear());
        setTime(calcTime(value));
    }, [value]);
    
    useEffect(() => {
        const [hour, minute] = time ? time.split(':') : [0, 0];
        // const date = new Date(year, month, day, hour, minute);
        
        const newDate = new Date(value);
        newDate.setYear(year);
        newDate.setMonth(month);
        newDate.setDate(day);
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        
        if (newDate.toISOString() !== value.toISOString()) {
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
                name     = { name + '-time'}
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
                name     = { name + '-day'}
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
                name     = { name + '-month'}
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
                name     = { name + '-year'}
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

    // const days   = Array.from({length: 31}, (_, i) => i + 1); 
    
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
            const time = formatTime(hour, minute);
            times[time] = time;
        }
    }
    
    return { days, months, years, times }
}

const calcTime = (date) => {
    const hours   = date.getHours();
    const minutes = date.getMinutes() - (date.getMinutes() % MINUTES_STEP);
    
    return formatTime(hours, minutes)
}

const formatTime = (hours, minutes) => {
    return [hours, minutes].map(v => String(v).padStart(2, '0')).join(':');
}

export default DateTimeInput
    