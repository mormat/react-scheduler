import GridBody   from './MonthlySheet/GridBody';
import GridHeader from './MonthlySheet/GridHeader';

import withFixedHeader    from '../Widget/withFixedHeader';
import withCreateEvent    from './withCreateEvent';
import withEventsLoading  from '../DataHandler/withEventsLoading';

import { DateRange }     from '../../utils/date';

function MonthlySheet( {dateRange, events, schedulerOptions, header} ) {

    
    
    let Grid = withFixedHeader(
        GridBody, 
        <>
            { header }
            <GridHeader { ... { schedulerOptions, dateRange } } />
        </>
    );
    if (schedulerOptions.editable) {
        Grid = withCreateEvent(Grid);
    }
    Grid = withEventsLoading(Grid, new DateRange(
        DateRange.createWeek(dateRange.start).start,
        DateRange.createWeek(dateRange.end).end,
    ));
    
    return (
        <div className="mormat-scheduler-Scheduler-MonthlySheet">
            <Grid { ... { dateRange, events, schedulerOptions }} />
        </div>
    )

}

export default MonthlySheet