import TableBody   from './TableBody';
import TableHeader from './TableHeader';
import withFixedHeader  from '../../Widget/withFixedHeader';

import { format_date } from '../../../utils/date'

import { groupBy } from '../../../utils/collections'

function Table({ events, schedulerOptions, dateRange, header })
{
    
    const eventsByType = groupBy(
        events.filter(e => dateRange.intersects(e)),
        function( {start, end } ) {
            
            if (format_date('yyyy-mm-dd', start) !== format_date('yyyy-mm-dd', end)) {
                return 'header';
            }
            
            if (start.getHours() < schedulerOptions.minHour) {
                return 'header';
            }

            if (end.getHours() > schedulerOptions.maxHour) {
                return 'header';
            }

            return 'body';
        }
    )
    
    const TableLayout = withFixedHeader(
        TableBody, 
        <>
            { header }
            <TableHeader 
                events = { eventsByType['header'] || [] }
                { ... { schedulerOptions, dateRange } } 
            />
        </>
    );
    
    return (
        <TableLayout 
            events = { eventsByType['body']  || []}
            { ... { schedulerOptions, dateRange } }
        />
    );
}

export default Table;