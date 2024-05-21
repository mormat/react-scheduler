
import { useEffect, useState, useRef } from 'react';

import DailyColumnsSheet from './Scheduler/DailyColumnsSheet'
import MonthlySheet      from './Scheduler/MonthlySheet'
import TimelineSheet     from './Scheduler/TimelineSheet'

import Header            from './Header'

import Button from './Widget/Button'
import ToggleButtonGroup from './Widget/ToggleButtonGroup';

import { DateRange } from '../utils/date';

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
        
    const [currentDate, setCurrentDate] = useState( 
        new Date(schedulerOptions.initialDate) 
    );
    
    const [viewMode, setViewMode] = useState( schedulerOptions.viewMode );
    
    const viewModeRenderers = {
        
        day: function() {
            
            const dateRange = DateRange.createDay(currentDate);
                        
            const title = currentDate.toLocaleString(
                schedulerOptions.locale, 
                {
                    weekday: "long",
                    month:   'short', 
                    day:     'numeric', 
                    year:    'numeric'
                }
            );
                        
            return (
                <DailyColumnsSheet 
                    key    = { 'day-' + currentDate }
                    header = { buildHeader(title) }
                    { ... {schedulerOptions, events, dateRange } }
                /> 
            )
        },
        
        week: function() {
            
            const dateRange = DateRange.createWeek(currentDate);
            
            const title = [dateRange.start, dateRange.end].map(function(d) {
                return d.toLocaleString(
                    schedulerOptions.locale, 
                    { month: 'short', day: 'numeric', year: 'numeric' }
                );
            }).join(' - ');
            
            return (
                <DailyColumnsSheet 
                    key    = { 'week-' + currentDate }
                    header = { buildHeader(title) }
                    { ... {schedulerOptions, events, dateRange } }
                /> 
            )
        },
        
        month: function() {
            
            const dateRange = DateRange.createMonth(currentDate);
                    
            const title = currentDate.toLocaleString(
                schedulerOptions.locale, 
                { month: 'long', year: 'numeric' }   
            );
                    
            return (
                <MonthlySheet 
                    key    = { 'month-' + currentDate }
                    header = { buildHeader(title) }
                    { ... {schedulerOptions, events, dateRange } }
                />
            )
        }
    }
        
    const buildHeader = (title) => (
        <Header 
            schedulerOptions = { schedulerOptions }
            { ... { title, currentDate, setCurrentDate, viewMode, setViewMode } }
        />
    )
           
    return (
        <div className="mormat-scheduler-Scheduler"
            id    = { schedulerOptions.id }
            style = { {
                width:  schedulerOptions.width,
                height: schedulerOptions.height,
            } }
        >       
            {  viewModeRenderers[viewMode]() }           
        </div>  
    )
    
}

export default Scheduler;
export { defaultSchedulerConfig };