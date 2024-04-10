
import { useUniqueId, getClassName, useLayoutSize } from '../../../utils/dom'

import { formatters, dateRangeOverlapsAnother, dateRangeContainsAnother } from '../../../utils/date'

import { calcEventsOffsets  } from '../../../models/events';

import EventContainer from './EventContainer';
import Grille from '../../Widget/Grille';

function TableBody( { events, schedulerOptions, dateRange } ) {

    
    const uniqueId  = useUniqueId();    
    const size = useLayoutSize(schedulerOptions);
    
    const yAxisWidth = size.width < 640 ? 30 : 70;
    
    const dates = [...dateRange.iterDays()];
    
    const hours = [];
    for (let h = schedulerOptions.minHour; h < schedulerOptions.maxHour; h++) {
        hours.push((('0' + h).slice(-2)) + ':00');
    }
    
    const columns = dates.map(date => {
        
        const day = formatters['yyyy-mm-dd'](date);
        
        const minHour = schedulerOptions.minHour + ':00';
        const maxHour = schedulerOptions.maxHour + ':00';
        
        const constraint = {
            start: new Date(day + ' ' + minHour),
            end: new Date(day + ' ' + maxHour)
        };
        
        const filteredEvents = events.filter(e => dateRangeContainsAnother(constraint, e));
        
        const eventsOffsets = calcEventsOffsets(filteredEvents);
        
        return { day, minHour, maxHour, constraint, events: filteredEvents, eventsOffsets }
        
    });
    
    const columnsDraggableAreaId = useUniqueId();
    
    const rowHeight = (size.height || 0) /hours.length;
        
    return (
        <div style = {{
                position: 'absolute',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
             }} 
        >
        
            <table className="mormat-scheduler-Scheduler-DailyColumnsSheet-TableBody" 
                style = { { 
                    width: "100%",
                    height: "100%"
                } } >

                <tbody id = { columnsDraggableAreaId }
                       data-draggable-area-type = 'day-column'
                       style= {{ position: 'relative' }} >

                    { hours.map( ( hour, index ) => (
                        <tr key   = { index } 
                            data-hour = { hour }>
                            <th style = { { 
                                width: yAxisWidth,
                                height: (100 / hours.length) + '%'
                            } }>
                                <span>{ hour }</span>
                                { index === 0 && <Grille rows = { hours.length } /> }
                            </th>
                            { index === 0 && columns.map( ({events, constraint, day, minHour, maxHour, eventsOffsets}, key) => (

                                <td key     = { key } 
                                    style   = { { position: "relative"} }
                                    rowSpan = { hours.length }
                                    data-day  = { day }
                                    data-minhour = { minHour }
                                    data-maxhour = { maxHour }
                                >
                                    { events.map((event, i) => (
                                        <EventContainer
                                               key        = { i }
                                               value      = { event }
                                               constraint = { constraint }
                                               schedulerOptions = { schedulerOptions }
                                               draggableAreaId  = { columnsDraggableAreaId }
                                               offset     = { eventsOffsets.get(event) }
                                        />
                                    )) }

                                </td>
                            )) }

                        </tr>
                    )) }
                </tbody>

            </table>
        </div>
    )
    
}

export default TableBody