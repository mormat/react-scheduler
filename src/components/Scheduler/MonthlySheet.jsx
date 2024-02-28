import BaseTable from './MonthlySheet/Table';

import withLayout from './withLayout';
import withResizeObserver from './withResizeObserver';
import withCreateEvent from './withCreateEvent';
import withEventsDynamicLoading from '../DataHandler/withEventsDynamicLoading';

import { formatters } from '../../utils/date';

import { getFirstDayOfWeek, getLastDayOfWeek } from '../../utils/date';

function MonthlySheet( {currentDate, events, schedulerOptions, layoutProps } ) {

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
    
    let Table = BaseTable;
    if (schedulerOptions.editable) {
        Table = withCreateEvent(BaseTable);
    }
    Table = withLayout(Table, { title, ...layoutProps });
    Table = withResizeObserver(Table);
    Table = withEventsDynamicLoading(Table, dateRange);
    
    return (
        <div className="mormat-scheduler-Scheduler-MonthlySheet">
            <Table  currentDate = { currentDate }
                    dateRange   = {dateRange} 
                    events      = { events }
                    schedulerOptions = { schedulerOptions }
            />
        </div>
    )

}

export default MonthlySheet