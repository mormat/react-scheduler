
import { useState } from 'react';

import { useUniqueId, getClassName } from '../../../utils/dom'

import { formatters, dateRangeOverlapsAnother, dateRangeContainsAnother } from '../../../utils/date'

import { calcEventsOffsets  } from '../../../models/events';

import Event from './Event';
import Grille from '../../Widget/Grille';
import TimelineRow from '../TimelineSheet/Row';

const yAxisWidth = 70;

function Table( { events, schedulerOptions, dateRange } ) {
    
    const dates = [];
    for (
        let t = dateRange.start.getTime(); 
        t <= dateRange.end.getTime(); 
        t += 24 * 60 * 60 * 1000 
    ) {
        dates.push(new Date(t));
    }
    
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
        
    const columnsEvents = columns.map(c => c.events).flat();
    const spannedEvents = events.filter(event => {
        if (columnsEvents.includes(event)) return false;
        return dateRangeOverlapsAnother(dateRange, event);
    });
    
    const columnsDraggableAreaId = useUniqueId();
    
    const calcRowStyle = () => {
        const height = (schedulerOptions.height - 130) / (hours.length)
        
        return { height: height + 'px'}
    }
    
    const calcDayStyle = () => {
        
        const width = (schedulerOptions.width - yAxisWidth) / (dates.length)
        
        return { width: width + 'px'}
    }
       
    return (
        <table className="mormat-scheduler-Scheduler-DailyColumnsSheet-Table" 
                   style = { { width: "100%" } } >

            <thead> 
                <tr>
                    <td style = { { width: yAxisWidth } }></td>
                    { dates.map( ( d, index) => (
                        <th key = { index } style = { calcDayStyle() }>
                            { d.toLocaleString(schedulerOptions.locale, {
                                weekday: 'short', 
                                month:    schedulerOptions.width < 1024 ? 'short' : 'long', 
                                day:     'numeric',
                            }) }
                        </th>
                    )) }
                </tr>
            </thead>

            { spannedEvents.length > 0 && (
                <tbody>
                    <tr>
                        <th></th>
                        <td colSpan={ dates.length }>
                            <TimelineRow
                                events    = { spannedEvents }
                                dateRange = { dateRange }
                                schedulerOptions = { schedulerOptions }
                            />
                        </td>
                    </tr>
                </tbody>
            )}

            <tbody id = { columnsDraggableAreaId }
                   data-draggable-area-type = 'day-column'
                   style= {{ position: 'relative' }} >

                { hours.map( ( hour, index ) => (
                    <tr key   = { index } 
                        style = { calcRowStyle() } 
                        data-hour = { hour }>
                        <th>
                            { hour }
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
                                    <Event key        = { i }
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
    )
    
}

export default Table