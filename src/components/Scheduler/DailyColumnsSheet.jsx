import { useEffect, useState, useRef, Fragment } from 'react';

import BaseTable          from './DailyColumnsSheet/Table';

import withCreateEvent    from './withCreateEvent';
import withEventsLoading  from '../DataHandler/withEventsLoading';

import { formatters, DateRange } from '../../utils/date';

function DailyColumnsSheet( { events = [], schedulerOptions, dateRange, header } ) {
    
    let Table = BaseTable;
    if (schedulerOptions.editable) {
        Table = withCreateEvent(Table);
    }
    Table = withEventsLoading(Table, dateRange);
    
    return (
        
        <div className = "mormat-scheduler-Scheduler-DailyColumnsSheet">
            <Table 
                events = { events }
                { ... { schedulerOptions, dateRange, header } }
            />
        </div>
        
    )
    
}


export default DailyColumnsSheet
    