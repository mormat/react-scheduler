
import { Fragment, useState, useEffect } from 'react';

import TimelineRow from '../TimelineSheet/Row';

import EventContainer from './EventContainer';

import Grille from '../../Widget/Grille';

import { useUniqueId } from '../../../utils/dom';

import { format_date, date_add, DateRange } from '../../../utils/date';

function GridBody( { dateRange, events, schedulerOptions } ) {
    
    const tbodyUniqueId = useUniqueId();
    
    const weeks = dateRange.getWeeks();
    
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
                    data-droppable-type = "timeline"
            >
                {weeks.map( ( week, k1) => (
                    <Fragment key = { k1 } >

                        <tr>
                            <td colSpan="7"
                                style = { {
                                    position: 'relative',
                                    height:    (100 / weeks.length) + '%',
                                } }
                            >

                                { week.getDays().map(( { start }, k2) => (
                                    <div
                                        key = { k2 }
                                        style= { {
                                            position: 'absolute',
                                            top:   0,
                                            left:  (k2 * 100 / 7) + '%',
                                            width: (100 / 7) + '%',
                                            bottom: 0
                                        } }
                                        data-day  = { format_date('yyyy-mm-dd', start) }
                                        data-current-month = { dateRange.includes(start) }
                                    >
                                        { start.getDate() }
                                    </div>
                                )) }

                                <Grille cols="7" />
                                        
                                <TimelineRow
                                    events    = { events.filter(e => week.intersects(e)) }
                                    dateRange = { week }
                                    droppableId  = { tbodyUniqueId } 
                                    draggableType    = "timeline"
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