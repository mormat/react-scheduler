
import { useState, useEffect } from 'react';

import TrashIcon from '../Widget/TrashIcon';

function EventsList( { events, selectedEvent, onEventSelect, onEventDelete } ) {
    
    const formatDateTime = (date) => {
        return  date.toLocaleDateString('en') + ' ' + 
                date.toLocaleTimeString().substring(0,5);
    }
    
    const handleEventSelect = (e, schedulerEvent) => {
        e.preventDefault();
        
        onEventSelect(schedulerEvent);
    }
    
    const handleEventDelete = (e, schedulerEvent) => {
        e.preventDefault();
        
        onEventDelete(schedulerEvent);
    }
    
    function renderLabel({ label }) {
        return label ? label : (<i>&lt;No description&gt;</i>);
    }
    
    return (
        <div>
            <table>
                <tbody>
                    { events.map((schedulerEvent, n) => (
                        <tr key= {n} className="mormat-scheduler-event">
                            <td>
                                <a  href="#" 
                                    onClick = { (e) => handleEventSelect(e, schedulerEvent) }
                                >
                                    { schedulerEvent === selectedEvent && (
                                        <strong>
                                            { renderLabel(schedulerEvent) }
                                        </strong>
                                    )} 
                            
                                    { schedulerEvent !== selectedEvent && renderLabel(schedulerEvent) } 
                                </a>
                            </td>
                            <td> 
                                <em>from </em>
                                { formatDateTime(schedulerEvent.start) } 
                            </td>
                            <td> 
                                <em>to </em>
                                { formatDateTime(schedulerEvent.end) } 
                            </td>
                            <td>
                                <button 
                                    title="Delete" 
                                    onClick = { e => handleEventDelete(e, schedulerEvent) }
                                >
                                    <TrashIcon width="12" height="12" />
                                </button>            
                            </td>
                        </tr>   
                    )) }
                </tbody>
            </table> 
        </div>
    )
    
}

export default EventsList
    