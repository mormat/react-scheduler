
import { useEffect, useState, useRef } from 'react';

import Header from './Scheduler/Header'
import DailyColumnsSheet from './Scheduler/DailyColumnsSheet'
import MonthlySheet from './Scheduler/MonthlySheet'

import { getDateRangeOfWeek, getDaysBetween } from '../utils/date';

import { buildEventsManager } from '../models/events';
import { overlaps } from '../models/events';

function Scheduler( config ) {
    
    const [currentDate, setCurrentDate] = useState(config.initialDate);
    const [events,      setEvents] = useState([]);
    const [eventsRepository,]     = useState(() => buildEventsManager({
        type:   'memory',
        events: config.events || []
    }));
    
    const [viewMode, setViewMode] = useState( config.viewMode );
    
    const onEventUpdate = (schedulerEvent) => {
        if (isEventValid(schedulerEvent)) {
            eventsRepository.save(schedulerEvent);
        }
        setEvents(eventsRepository.load());
        
        if (config.onEventUpdate) {
            config.onEventUpdate(schedulerEvent);
        }
    }
    
    const isEventValid = (schedulerEvent) => {
        if (!config.enableOverlapping) {
            const overlappingEvents = events.filter(v => overlaps(schedulerEvent, v));
            return overlappingEvents.length === 0;
        }
        return true;
    }
    
    useEffect(() => {
        setEvents(eventsRepository.load());
    }, [currentDate]);
    
    const getDays = () => {
        
        switch (viewMode) {
            case 'week':
                return getDaysBetween(getDateRangeOfWeek(currentDate));
            case 'day':
                return [ currentDate ];
            default:
                return []
        }
        
    }
    
    const renderSheet = () => {
        
        switch (viewMode) {
         
            case 'week':
            case 'day':
                const days = getDays();
                
                return (
                    <DailyColumnsSheet 
                        key       = { viewMode + '-' + days[0] }
                        days      = { days }  
                        events    = { events }
                        onEventUpdate = { onEventUpdate }
                        locale    = { config.locale }
                        draggable = { config.draggable }
                        minHour   = { config.minHour }
                        maxHour   = { config.maxHour }
                    /> 
                )
            case 'month' : {
                    
                const d = new Date(currentDate);
                
                return (
                    <MonthlySheet 
                        fullYear = { d.getFullYear() }
                        month    = { d.getMonth() }
                        locale   = { config.locale }
                        events   = { events }
                    />
                )
        
            }
        }
        
    }
        
    return (
        <div className="mormat-scheduler-Scheduler">

            <Header 
                date             = { currentDate }
                onDateChange     = { setCurrentDate }
                viewMode         = { viewMode }
                onViewModeChange = { setViewMode }
            />
                    
            { renderSheet() }
            
        </div>  
    )
    
}

export default Scheduler