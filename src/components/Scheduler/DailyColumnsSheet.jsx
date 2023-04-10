import { useEffect, useState, useRef, Fragment } from 'react';

import DailyColumnsEvent from './DailyColumnsEvent';
import Grille from './Grille';

import { createDragHandler } from '../../misc/drag-handlers';
import { calcEventsOffsets } from '../../models/events';
import createLayout from '../../misc/layouts';

import { hourToString, getHoursBetween } from '../../utils/date';

const formatDateOptions = {
    weekday: 'short', 
    year:    'numeric', 
    month:   'long', 
    day:     'numeric',
}

function DailyColumnsSheet( { events = [], days = [], locale = 'en', rowHeight = 50, draggable = true, minHour, maxHour, onEventUpdate } ) {
    
    const [columnsLayout, setColumnsLayout] = useState(null);
    const [dragHandler,   setDragHandler]   = useState(null);
    const daysAsStrings = days.map(v => new Date(v).toISOString().substring(0, 10));
    
    const hours = getHoursBetween(
        `1970-01-01 ${minHour}:00`,
        `1970-01-01 ${maxHour}:00`
    );
    
    const parentRef    = useRef(null);
    
    const isSingleDayEvent = ({start, end}) => start.getDate() === end.getDate();
    const multiDaysEvents  = events.filter(v => !isSingleDayEvent(v));
    
    const eventsOffsets = new Map([
        ...calcEventsOffsets(events.filter(v =>  isSingleDayEvent(v))),
        ...calcEventsOffsets(multiDaysEvents)
    ]);
    
    useEffect(() => {
        
        const element = parentRef.current;
        
        const resize = () => {
            
            const columnsLayout = createLayout({
                element,
                type: 'columns',
                step: 15 * 60 * 1000
            });
            
            setColumnsLayout(columnsLayout);
            
            if (draggable) {
                const dragHandler = createDragHandler({
                    minLength: 15 * 60 * 1000,
                    columnsLayout, 
                }); 
                
                setDragHandler(dragHandler);
            } else {
                setDragHandler(null);
            }
    
        }
        
        resize();
        
        const resizeObserver = new ResizeObserver(() => {
            element.dispatchEvent(new CustomEvent('react-scheduler_resize'));
        });
        resizeObserver.observe(element);
        
        // @todo test that resize event has been removed
        return () => {
            resizeObserver.unobserve(element);
        }
        
    }, []);
    
    const getColumnAttrs = dayAsString => {
            
        const minHour = hourToString(hours[0]);
        let maxHour = hourToString(hours.at(-1));
        
        if (maxHour === '00:00') {
            maxHour = '23:59';
        }
            
        return {
            'data-day'     : dayAsString,
            'data-datemin' : dayAsString + ' ' + minHour,
            'data-datemax' : dayAsString + ' ' + maxHour
        }
    }
    
    return (
            
        <div>
            
            <div ref = { parentRef } 
                 className = "mormat-scheduler-Scheduler-DailyColumnsSheet"
                 style = { { position: "relative" } } >

                <table className="react-scheduler-table" 
                       style = { { width: "100%" } } >

                    <thead> 
                        <tr>
                            <td></td>
                            { daysAsStrings.map( ( dayAsString, index) => (
                                <th key = { index } >
                                    { new Date(dayAsString).toLocaleString(locale, formatDateOptions) }
                                </th>
                            )) }
                        </tr>
                    </thead>

                    <tbody>
                        { multiDaysEvents.length > 0 && (
                            <tr
                                style   = { {
                                    position: 'relative',
                                    height:   multiDaysEvents.length * 20
                                } }
                            >
                                <th></th>
                                <td colSpan={ daysAsStrings.length }
                                    data-datemin = { daysAsStrings[0] + ' 00:00' }
                                    data-datemax = { daysAsStrings.at(-1) + ' 23:59' }
                                > 
                                </td>
                            </tr>
                        )}
                
                    </tbody>
                    
                    <tbody style= {{ position: 'relative' }} >
                    
                        { hours.slice(0, -1).map( ( hour, index ) => (
                            <tr key   = { index } 
                                style = { { height: rowHeight }} 
                                data-hour = { hourToString(hour) }>
                                <th>
                                    { hourToString(hour) }
                                    { index === 0 && <Grille rows = { hours.length - 1 } /> }
                                </th>
                                { index === 0 && daysAsStrings.map( (dayAsString, index) => (
                                    <td key = { index } 
                                        className = { `day-${dayAsString}` }
                                        rowSpan={ hours.length - 1 }
                                        { ... getColumnAttrs(dayAsString) }
                                    />
                                )) }
                        
                            </tr>
                        )) }
                    </tbody>

                </table>
                
                { events.map( (event, index) => (
                    <div key = { index }>
                        <DailyColumnsEvent 
                            value          = { event } 
                            onDrop         = { (values) => handleEventDrop(values, event) }
                            events         = { events }
                            dragHandler    = { isSingleDayEvent(event) ? dragHandler : null}
                            columnsLayout  = { columnsLayout }
                            onEventUpdate  = { onEventUpdate }
                            eventOffset    = { eventsOffsets.get(event) }
                        />
                    </div>
                )) }

            </div>

        </div>
    )
    
}

function Debug( { columnsLayout } )
{
    const [label, setLabel] = useState('waiting ...');
    
    
    useEffect(() => {

        const n = Math.floor(Math.random() * 100);

        const mousemove = function(e) {
            let label = '???';
            if (columnsLayout) {
                const date = columnsLayout.getValueAtCoord(e);
                label = date.toLocaleString('fr', formatDateOptions + {
                    hour:    'numeric',
                    minute:  'numeric',
                });
            }
            setLabel(label);
        }
        window.addEventListener('mousemove', mousemove);
         
        return () => {
            window.removeEventListener('mousemove', mousemove);
        }
         
    }, [columnsLayout]);
    
    return (
        <h4>{ label }</h4>
    );
}

export default DailyColumnsSheet
    