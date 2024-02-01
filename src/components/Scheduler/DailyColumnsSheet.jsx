import { useEffect, useState, useRef, Fragment } from 'react';

import BaseTable from './DailyColumnsSheet/Table';

import withLayout from './withLayout';
import withResizeObserver from './withResizeObserver';
import withCreateEvent from './withCreateEvent';
import withEventsDynamicLoading from '../DataHandler/withEventsDynamicLoading';

import { formatters } from '../../utils/date';

import { findDOMNode } from 'react-dom';

function DailyColumnsSheet( { events = [], schedulerOptions, startDate, length, layoutProps } ) {
    
    const start = new Date(formatters['yyyy-mm-dd'](startDate) + ' 00:00');
    const end   = new Date(start.getTime() + (length - 1 ) * 24 * 60 * 60 * 1000);
    end.setHours(23);
    end.setMinutes(59);
    
    const dateRange = { start, end }

    const title = (length > 1 ? [start, end] : [start])
        .map(d => d.toLocaleString(
        schedulerOptions.locale, 
        {
            month:   'short', 
            day:     'numeric', 
            year:    'numeric'
        }
    )).join(' - ')
    
    let Table = BaseTable;
    Table = withCreateEvent(Table);
    Table = withLayout(Table, { title, ...layoutProps });
    Table = withResizeObserver(Table);
    Table = withEventsDynamicLoading(Table, dateRange);
    
    return (
        
        <div className = "mormat-scheduler-Scheduler-DailyColumnsSheet">
            
            <Table events = { events }
                   schedulerOptions = { schedulerOptions }
                   dateRange = { dateRange }
            />
        </div>
        
    )
    
}

export default DailyColumnsSheet
    