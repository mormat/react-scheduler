import GridBody   from './MonthlySheet/GridBody';
import GridHeader from './MonthlySheet/GridHeader';

import { withLayout }     from './TimelineSheet';
import withCreateEvent    from './withCreateEvent';
import withEventsLoading  from '../DataHandler/withEventsLoading';

import { formatters }     from '../../utils/date';

import { getFirstDayOfWeek, getLastDayOfWeek } from '../../utils/date';

function MonthlySheet( {currentDate, events, schedulerOptions, header} ) {

    const dateRange = {
        start: new Date(currentDate),
        end:   new Date(currentDate),
    }
    
    dateRange.start.setDate(1);
    dateRange.end.setDate(1);
    dateRange.end.setMonth(dateRange.end.getMonth() + 1);
    dateRange.end.setDate(dateRange.end.getDate() - 1);

    dateRange.start = new Date(getFirstDayOfWeek(dateRange.start) + ' 00:00');
    dateRange.end   = new Date(getLastDayOfWeek(dateRange.end)    + ' 23:59');
    
    const title = currentDate.toLocaleString(
        schedulerOptions.locale, 
        { month: 'long', year: 'numeric' }
    );
    
    const subheader = (
        <GridHeader { ... { schedulerOptions, dateRange } } />
    );
    
    let Grid = withLayout(
        GridBody, 
        { header, subheader }
    );
    if (schedulerOptions.editable) {
        Grid = withCreateEvent(Grid);
    }
    Grid = withEventsLoading(Grid, dateRange);
    
    return (
        <div className="mormat-scheduler-Scheduler-MonthlySheet">
            <Grid { ... { currentDate, dateRange, events, schedulerOptions }} />
        </div>
    )

}

export default MonthlySheet