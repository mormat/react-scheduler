import TableBody      from './TableBody';
import TableHeader    from './TableHeader';
import { withLayout } from '../TimelineSheet';

import { format_date, DateRange, dateRangeOverlapsAnother, dateRangeContainsAnother } from '../../../utils/date'

function Table({ events, schedulerOptions, dateRange, header })
{
    const { start, end } = dateRange;
    
    const days = [...dateRange.iterDays()].map(d => {
        const str   = format_date('yyyy-mm-dd', d) + ' ';
        const start = str + schedulerOptions.minHour + ':00';
        const end   = str + schedulerOptions.maxHour + ':00';
        return new DateRange(  new Date(start), new Date(end) );
    });
    
    const displayedEvents = events.filter(e => dateRange.overlapsWith(e));
    const bodyEvents = displayedEvents.filter(event => {
        for (const day of days) {
            if (day.contains(event)) {
                return true;
            }
        }
        return false;
    });
    const headerEvents = displayedEvents.filter(e => !bodyEvents.includes(e));
    
    const subheader = (
        <TableHeader 
            events = { headerEvents }
            { ... { days, schedulerOptions, dateRange } } 
        />
    )
    
    const TableLayout = withLayout(
        TableBody, 
        { header, subheader }
    );
    
    return (
        <TableLayout 
            events = { bodyEvents }
            { ... { schedulerOptions, dateRange } }
        />
    );
}

export default Table;