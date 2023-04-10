
import { groupByCols } from '../../utils/template';

import constants from '../../constants';

import DailyTimeline from './DailyTimeline';

import { Fragment } from 'react';

import Grille from './Grille';

import { getDateRangeOfMonth, getDateRangeOfWeek, getDaysBetween, dateToString } from '../../utils/date';

function MonthlySheet( {fullYear, month, locale, events} ) {

    const firstDay = new Date(fullYear, month, 1);

    const weekdays = Array.from(
        {length: 7}, 
        (_, i) => new Date(1970, 1, i + 2).toLocaleString(locale, { weekday: 'long' } )
    );
    
    const dateRange = getDateRangeOfMonth(firstDay);
    const firstWeek = getDateRangeOfWeek(dateRange.start);
    const lastWeek  = getDateRangeOfWeek(dateRange.end);
    
    const days = getDaysBetween({
        start: firstWeek.start,
        end: lastWeek.end
    });
    
    const getSingleDayEvents = (at) => events.filter(e => {
       return   dateToString(at)      === dateToString(e.start) &&
                dateToString(e.start) === dateToString(e.end)
                
    });
    
    const getSpannedEvents = (from, to) => events.filter(e => {
       return  dateToString(e.start) !== dateToString(e.end) &&
               dateToString(e.end)    >= dateToString(from)  && 
               dateToString(to)       >= dateToString(e.start)
    });
    
    const getEventStyle = ({color, bgColor}) => {
        return {
            color: color || constants.EVENT_DEFAULT_COLOR, 
            backgroundColor: bgColor || constants.EVENT_DEFAULT_BG_COLOR
        };
    };
    
    return (
        <div className="mormat-scheduler-Scheduler-MonthlySheet">
            <h2>{ firstDay.toLocaleString(locale, { month: 'long', year: 'numeric' }) }</h2>
                
            <table style = {{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        { weekdays.map((weekday, k) => (
                            <th key   = { k }
                                style = {{ 
                                    width: (100 / 7) + '%',
                                    wordWrap: 'break-word',
                                    overflow: 'hidden'
                                }}>
                                { weekday }
                            </th>
                        )) }
                    </tr> 
                </thead>
                <tbody style = {{ 'position': 'relative'}}>
                    { groupByCols(days, 7).map( (row, k1) => (
                        <Fragment key = { k1 } >
                            <tr>
                                { row.map((day, k2) => (
                                    <td key = { k2 } 
                                        className = { 'day_header ' + (day.getMonth() === month ? 'current_month': '') }
                                        { ... { 'data-day': dateToString(day) }}
                                    >
                                        
                                        { day.getDate() }
                                    </td>
                                )) }
                            </tr>
                            <tr>
                                <td colSpan="7">
                                    
                                    <DailyTimeline
                                        events    = { getSpannedEvents(row[0], row[6]) }
                                        dateRange = { { start: row[0], end: row[6] } }
                                    />
                                    
                                </td>
                            </tr>
                            <tr>
                                { row.map((day, k2) => (
                                    <td key = { k2 } 
                                        className = { 'day_body ' + (day.getMonth() === month ? 'current_month': '') }
                                        { ... { 'data-day': dateToString(day) }}
                                    >
                                        <div>
                                            { getSingleDayEvents(day).map( (event, index) => (
                                                <Fragment key = { index }>
                                                    <div 
                                                        className = "mormat-scheduler-event"
                                                        style     = { getEventStyle(event) }
                                                    >
                                                        { event.label }
                                                    </div>

                                                </Fragment>
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
        </div>
    )

}

export default MonthlySheet