import { useEffect, useState, useRef, Fragment } from 'react';

import BaseTable          from './DailyColumnsSheet/Table';

import { withLayout }     from './TimelineSheet';
import withCreateEvent    from './withCreateEvent';
import withEventsLoading  from '../DataHandler/withEventsLoading';

import { formatters, DateRange } from '../../utils/date';

function DailyColumnsSheet( { events = [], schedulerOptions, startDate, length, header } ) {
    
    const start = new Date(formatters['yyyy-mm-dd'](startDate) + ' 00:00');
    const end   = new Date(start.getTime() + (length - 1 ) * 24 * 60 * 60 * 1000);
    end.setHours(23);
    end.setMinutes(59);
    
    const dateRange = new DateRange(start, end);

    let Table = BaseTable;
    if (schedulerOptions.editable) {
        Table = withCreateEvent(Table);
    }
    Table = withEventsLoading(Table, dateRange);
    
    return (
        
        <div className = "mormat-scheduler-Scheduler-DailyColumnsSheet"
             data-daily-columns-sheet-length = { length }
        >
            <Table 
                events = { events }
                { ... { schedulerOptions, dateRange, header } }
            />
        </div>
        
    )
    
}


export default DailyColumnsSheet
    