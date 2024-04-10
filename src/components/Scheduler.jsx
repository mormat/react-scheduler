
import { useEffect, useState, useRef } from 'react';

import DailyColumnsSheet from './Scheduler/DailyColumnsSheet'
import MonthlySheet      from './Scheduler/MonthlySheet'
import TimelineSheet     from './Scheduler/TimelineSheet'

import Header            from './Header'

import Button from './Widget/Button'
import ToggleButtonGroup from './Widget/ToggleButtonGroup';

import { getFirstDayOfWeek, date_add, DateRange } from '../utils/date';

const defaultSchedulerConfig = {
    events: [],
    initialDate: Date.now(),
    viewMode: 'week',
    timelined: false,
    defaultEventBgColor: '#0288d1',
    defaultEventColor: 'white',
    locale: 'en',
    width:  800,
    height: 600,
    spannedEventHeight: 20,
    minHour: 6,
    maxHour: 22,
    draggable: true,
    editable: true,
    onEventCreate: () => {},
    onEventUpdate: () => {},
    onEventDelete: () => {},
    labels: {},
}

function Scheduler( { events, schedulerOptions } ) {
        
    const [currentDate, setCurrentDate] = useState(schedulerOptions.initialDate);
    
    const [viewMode, setViewMode] = useState( schedulerOptions.viewMode );
    
    const layoutProps = { currentDate, setCurrentDate, viewMode, setViewMode }
        
    const getTitle = () => {
        
        const date = new Date(currentDate);
        
        switch (viewMode) {
            
            case 'day':
                
                return date.toLocaleString(
                    schedulerOptions.locale, 
                    {
                        weekday: "long",
                        month:   'short', 
                        day:     'numeric', 
                        year:    'numeric'
                    }
                );
        
            case 'week':
                
                const week = DateRange.createWeek(date);
                
                return [week.start, week.end].map(d => d.toLocaleString(
                    schedulerOptions.locale, 
                    {
                        month:   'short', 
                        day:     'numeric', 
                        year:    'numeric'
                    }
                )).join(' - ');
                
            case 'month':
                
                return date.toLocaleString(
                    schedulerOptions.locale, 
                    { 
                        month: 'long', 
                        year: 'numeric' 
                    }   
                )
                    
        }
        
    }
    
    const getSheet = () => {
        
        const d = new Date(currentDate);
        
        if (schedulerOptions.timelined) {
            return (
                <TimelineSheet 
                    currentDate = { d }
                    events      = { events }
                    schedulerOptions = { schedulerOptions }
                    layoutProps = { layoutProps }
                />
            )
        }
        
        switch (viewMode) {
         
            case 'week':
                
                return (
                    <DailyColumnsSheet 
                        key       = { 'week-' + currentDate }
                        startDate = { new Date(getFirstDayOfWeek(currentDate)) }
                        length    = { 7 }
                        events    = { events }
                        header    = { getHeader() }
                        schedulerOptions = { schedulerOptions }
                        layoutProps = { layoutProps }
                    /> 
                )

            case 'day':
                
                return (
                    <DailyColumnsSheet 
                        key       = { 'day-' + currentDate }
                        startDate = { new Date(currentDate) }
                        length    = { 1 }
                        events    = { events }
                        header    = { getHeader() }
                        schedulerOptions = { schedulerOptions }
                        layoutProps = { layoutProps }
                    /> 
                )
        
            case 'month' : {
                    
                return (
                    <MonthlySheet 
                        currentDate = { d }
                        events      = { events }
                        header      = { getHeader() }
                        schedulerOptions = { schedulerOptions }
                        layoutProps = { layoutProps }
                    />
                )
        
            }
        }
        
    }
    
    const getHeader = () => (
        <Header 
            schedulerOptions = { schedulerOptions }
            title = { getTitle() }
            { ...layoutProps }
        />
    )
    
    const getStyles = () => {
        const styles = {}
        
        for (const key of ['width', 'height']) {
            let value = schedulerOptions[key];
            if (!isNaN(Number(value))) {
                value += 'px';
            }
            styles[key] = value;
        }
        
        return styles;
    }
           
    return (
        <div className="mormat-scheduler-Scheduler"
            id    = { schedulerOptions.id }
            style = { getStyles() }
        >       
            {  getSheet() }           
        </div>  
    )
    
}

export default Scheduler;
export { defaultSchedulerConfig };