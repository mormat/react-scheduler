
import { useEffect, useState } from 'react';

import ViewModeSelector from './Header/ViewModeSelector';

import DateBrowser from './Header/DateBrowser';

function Header( { date, onDateChange, viewMode, onViewModeChange } ) {
    
    const onNextClick = () => {
        const newDate = new Date(date);
        
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (viewMode === 'month') {
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);
        }
        
        onDateChange(newDate);
    }
    
    const onPreviousClick = () => {
        const newDate = new Date(date);
        
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (viewMode === 'month') {
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() - 1);
        }
        
        onDateChange(newDate);
    }
    
    const onTodayClick = () => {
        onDateChange(new Date());
    }
    
    return (
            
        <div className="mormat-scheduler-Scheduler-Header">
            <div>
                <DateBrowser { ... { onNextClick, onPreviousClick, onTodayClick } } />
            </div>
            <div>
                <ViewModeSelector { ... { viewMode, onViewModeChange } } />
            </div>
        </div>
            
    )
    
}

export default Header