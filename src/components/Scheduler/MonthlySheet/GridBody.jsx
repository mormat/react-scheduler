
import { Fragment, useState, useEffect } from 'react';

import TimelineRow from '../TimelineSheet/Row';

import EventContainer from './EventContainer';

import Grille from '../../Widget/Grille';

import { useUniqueId, useLayoutSize } from '../../../utils/dom';

import { formatters, date_add, DateRange } from '../../../utils/date';

import { groupByCols, indexBy } from '../../../utils/collections';

function GridBody( { currentDate, dateRange, events, schedulerOptions } ) {
    
    const size = useLayoutSize(schedulerOptions);
        
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
            
            const week = DateRange.createWeek(row[0]);
            
            const spannedEvents = getSpannedEvents(row[0], row.at(-1));
            
            const countWeeks = Object.keys(datesByWeek).length;
            
            const height = (100) / countWeeks;
            
            return { row, week, height }
        })
    }
    
    const headerHeight = 17;
    
    return (
            
        <table 
            className = "mormat-scheduler-Scheduler-MonthlySheet-GridBody"
            style = {{ 
                position: 'absolute',
                top: '0',
                left: '0',
                width:  '100%', 
                height: '100%',
                tableLayout: 'fixed', 
                borderSpacing: 0, 
                borderCollapse: 'none'
            }}>
            <tbody  id    = { tbodyUniqueId } 
                    style = {{ 'position': 'relative'}} 
                    data-draggable-area-type = "monthly_sheet"
            >
                {groupByRow().map( ( {row, week, height }, k1) => (
                    <Fragment key = { k1 } >

                        <tr>
                            <td colSpan="7"
                                style = { {
                                    position: 'relative',
                                    height:    height + '%',
                                } }
                            >

                                { row.map((d, k2) => (
                                    <div
                                        key = { k2 }
                                        style= { {
                                            position: 'absolute',
                                            top:   0,
                                            left:  (k2 * 100 / 7) + '%',
                                            width: (100 / 7) + '%',
                                            bottom: 0
                                        } }
                                        data-day  = { formatters['yyyy-mm-dd'](d) }
                                        data-current-month = { d.getMonth() === currentDate.getMonth() }
                                    >
                                        { d.getDate() }
                                    </div>
                                )) }

                                <Grille cols="7" />
                                        
                                <TimelineRow
                                    events    = { events.filter(e => week.overlapsWith(e)) }
                                    dateRange = { week }
                                    draggableAreaId  = { tbodyUniqueId } 
                                    draggableType    = "monthly-sheet"
                                    schedulerOptions = { schedulerOptions }
                                />
                            </td>
                        </tr>



                    </Fragment>
                )) }
            </tbody>
        </table>
        
    )
    
}

export default GridBody