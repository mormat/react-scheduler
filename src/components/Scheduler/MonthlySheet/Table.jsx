
import { Fragment } from 'react';

import TimelineRow from '../TimelineSheet/Row';

import Event from './Event';

import Grille from '../../Widget/Grille';

import { useUniqueId } from '../../../utils/dom';

import { formatters, date_add } from '../../../utils/date';

import { groupByCols, indexBy } from '../../../utils/collections';

function Table( { currentDate, dateRange, events, schedulerOptions } ) {
    
    const dates = [];
    
    let d = new Date(dateRange.start);
    while (d < dateRange.end) {
        dates.push(d);
        d = date_add(d, 1, 'day')
    }
        
    const tbodyUniqueId = useUniqueId();
    
    const getDayEvents = (day) => events.filter(e => {
        const f = d => formatters['yyyy-mm-dd'](d);
        
        return f(day) === f(e.start) && f(day) === f(e.end);
    });
    
    const getSpannedEvents = (from, to) => events.filter(e => {
        const f = d => formatters['yyyy-mm-dd'](d);   
        
        return f(e.start) !== f(e.end) &&
               f(e.end)    >= f(from)  && 
               f(to)       >= f(e.start)
    });
    
    const groupByRow = () => {
        const datesByWeek = indexBy(dates,  (_, k) => Math.floor(k / 7) );
        
        return Object.values(datesByWeek).map(row => {
            const spannedEvents = getSpannedEvents(row[0], row.at(-1));
            
            const countWeeks = Object.keys(datesByWeek).length;
            
            const height = (schedulerOptions.height - 210) / countWeeks;
            return { row, spannedEvents, height }
        })
    }
    
    return (
        <table 
            className = "mormat-scheduler-Scheduler-MonthlySheet-Table"
            style = {{ tableLayout: 'fixed' }}>
            <thead>
                <tr>
                    { dates.slice(0, 7).map((d, k) => (
                        <th key   = { k }
                            style = {{ 
                                width: (100 / 7) + '%',
                                wordWrap: 'break-word',
                                overflow: 'hidden'
                            }}>
                            { d.toLocaleString(schedulerOptions.locale, { weekday: 'long' } ) }
                        </th>
                    )) }
                </tr> 
            </thead>
            <tbody  id    = { tbodyUniqueId } 
                    style = {{ 'position': 'relative'}} 
                    data-draggable-area-type = "monthly_sheet"
            >
                {groupByRow().map( ( {row, spannedEvents, height }, k1) => (
                    <Fragment key = { k1 } >
                        <tr>
                            { row.map((d, k2) => (
                                <td key = { k2 } 
                                    style = { { height: '10px' } }
                                    data-role = "header"
                                    data-day  = { formatters['yyyy-mm-dd'](d) }
                                    data-current-month = { d.getMonth() === currentDate.getMonth() }
                                >

                                    { d.getDate() }
                                </td>
                            )) }
                        </tr>
                        <tr>
                            <td colSpan="7">

                                <TimelineRow
                                    events    = { spannedEvents }
                                    dateRange = { { start: row[0], end: row.at(-1) } }
                                    draggableAreaId = { tbodyUniqueId } 
                                    schedulerOptions   = { schedulerOptions }
                                />

                            </td>
                        </tr>
                        <tr style = { { height: (height - 10) + 'px' } }>
                            { row.map((d, k2) => (
                                <td key = { k2 } 
                                    
                                    data-role = "content"
                                    data-day  = { formatters['yyyy-mm-dd'](d) }
                                >
                                    <div>
                                        { getDayEvents(d).map( (event, index) => (
                                            <Event 
                                                key = { index }
                                                value = { event }
                                                draggableAreaId = { tbodyUniqueId }
                                                schedulerOptions = { schedulerOptions }
                                            />
                                        ))}
                                    </div>
                                </td>
                            )) }
                        </tr>
                    </Fragment>
                )) }
                <tr>
                    <td colSpan="7">
                        <Grille cols="7" />
                    </td>
                </tr>
            </tbody>
        </table>
    )
    
}

export default Table