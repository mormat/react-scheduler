
import { Fragment } from 'react';

import { useUniqueId, getClassName } from '../../../utils/dom'

import { format_date, DateRange } from '../../../utils/date'

import EventContainer from './EventContainer';
import Grille from '../../Widget/Grille';

function TableBody( { events, schedulerOptions, dateRange } ) {
    
    const uniqueId  = useUniqueId();    
    
    const yAxisWidth = 30;
    
    const hours = [];
    for (let h = schedulerOptions.minHour; h < schedulerOptions.maxHour; h++) {
        hours.push((('0' + h).slice(-2)) + ':00');
    }
    
    const columns = dateRange.getDays().map( ({start} ) => {
        
        const day = format_date('yyyy-mm-dd', start);
        
        const minHour = schedulerOptions.minHour + ':00';
        const maxHour = schedulerOptions.maxHour + ':00';
        
        const constraint = new DateRange(
            new Date(day + ' ' + minHour),
            new Date(day + ' ' + maxHour)
        );
        
        const filteredEvents = events.filter(e => constraint.contains(e));
    
        const groupedEvents = DateRange.groupByPosition(filteredEvents);
        
        return { day, minHour, maxHour, constraint, groupedEvents }
        
    });
    
    const columnsDroppableId = useUniqueId();
        
    return (
        <div style = {{
                position: 'absolute',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
             }} 
        >
        
            <table 
            
                className = "mormat-scheduler-Scheduler-DailyColumnsSheet-TableBody" 
                id = { columnsDroppableId }
                data-droppable-type = 'day-column'
                style = { {  width: "100%", height: "100%" } } 
                
            >

                <tbody 
                    style= {{ position: 'relative' }} 
                >

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
                            { index === 0 && columns.map( ({groupedEvents, constraint, day, minHour, maxHour}, key) => (

                                <td key     = { key } 
                                    style   = { { position: "relative"} }
                                    rowSpan = { hours.length }
                                    data-day  = { day }
                                    data-minhour = { minHour }
                                    data-maxhour = { maxHour }
                                >
                                    { groupedEvents.map((events, position) => (
                                        
                                        <Fragment key = { position }>
                                
                                            { events.map((event, k) => (
                                                <EventContainer
                                                    key        = { k }
                                                    value      = { event }
                                                    constraint = { constraint }
                                                    schedulerOptions = { schedulerOptions }
                                                    droppableId  = { columnsDroppableId }
                                                    offset     = { { current: position, length: groupedEvents.length } }
                                                />
                                            )) }
    
                                        </Fragment> 
    
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