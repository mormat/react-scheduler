
import { useEffect, useState, useRef } from 'react';

import DailyColumnsSheet from './Scheduler/DailyColumnsSheet'
import MonthlySheet from './Scheduler/MonthlySheet'

import Button from './Widget/Button'
import ToggleButtonGroup from './Widget/ToggleButtonGroup';

import { getFirstDayOfWeek, date_add } from '../utils/date';

const defaultSchedulerConfig = {
    events: [],
    initialDate: Date.now(),
    viewMode: 'week',
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
}

function Scheduler( { events, schedulerOptions } ) {
    
    const [currentDate, setCurrentDate] = useState(schedulerOptions.initialDate);
    
    const [viewMode, setViewMode] = useState( schedulerOptions.viewMode );
    
    const layoutProps = { currentDate, setCurrentDate, viewMode, setViewMode }
    
    const renderSheet = () => {
        
        const d = new Date(currentDate);
        
        switch (viewMode) {
         
            case 'week':
                
                return (
                    <DailyColumnsSheet 
                        key       = { 'week-' + currentDate }
                        startDate = { new Date(getFirstDayOfWeek(currentDate)) }
                        length    = { 7 }
                        events    = { events }
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
                        schedulerOptions = { schedulerOptions }
                        layoutProps = { layoutProps }
                    /> 
                )
        
            case 'month' : {
                    
                return (
                    <MonthlySheet 
                        currentDate = { d }
                        events      = { events }
                        schedulerOptions = { schedulerOptions }
                        layoutProps = { layoutProps }
                    />
                )
        
            }
        }
        
    }
            
    return (
        <div className="mormat-scheduler-Scheduler">
                    
            { renderSheet() }
                    
        </div>  
    )
    
}

export default Scheduler;
export { defaultSchedulerConfig };