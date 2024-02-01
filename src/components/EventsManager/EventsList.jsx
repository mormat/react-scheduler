
import { useState, useEffect, Fragment } from 'react';

import DateTimeInput from '../Widget/DateTimeInput';
import TrashIcon from '../Widget/TrashIcon';
import Message   from '../Widget/Message';

import { formatters } from '../../utils/date';
import { cleanEvent } from '../../models/events';

function EventsList( { events = [], name = 'events' } ) {
    
    const [rows, setRows] = useState(events.map(cleanEvent));
    
    const handleChange = (numRow, name, value) => {
        rows[numRow][name] = value;
        
        setRows([...rows]);
    }
    
    const handleDelete = (e, row) => {
        e.preventDefault();
        
        setRows(rows.filter(r => r !== row));
    }
    
    const handleCreate = (e) => {
        e.preventDefault();
        
        const newRow = {
            label: "",
            start: new Date(Date.now()),
            end: new Date(Date.now() + 15 * 60 * 1000)
        }
        
        setRows([...rows, newRow]);
    }
    
    const getErrors = ({label, start, end}) => {
        const errors = [];
        if (!label) {
            errors.push("Label required");
        }
        if (start > end) {
            errors.push("Invalid date range");
        }
        
        return errors;
    }
    
    return (
        <fieldset className="mormat-scheduler-EventsManager-EventsList">
        
            <table>
            
                <tbody>
            
                    { rows.map((row, numRow) => (

                        <Fragment key = { numRow } >

                            <tr data-nth-event = { numRow + 1 } >
                                
                                <td colSpan="3">
                                
                                    { getErrors(row).map((error, index) => (
                                        <Fragment key= { index }>
                                            <Message type="error">
                                                { error }
                                            </Message>
                                            <input 
                                                type  = "hidden"
                                                name  = { name + `[errors][${numRow}][nth-event]` }
                                                value = { numRow + 1 }
                                            />
                                            <input 
                                                type  = "hidden"
                                                name  = { name + `[errors][${numRow}][message]` }
                                                value = { error }
                                            />
                                        </Fragment>
                                    )) }
                                
                                </td>
                            
                            </tr>

                            <tr data-nth-event = { numRow + 1 } >

                                <td>
                                    <input type  = "text" 
                                       name  = { name + `[items][${numRow}][label]` }
                                       value = { row.label }
                                       onChange = { e => handleChange(numRow, 'label', e.target.value) }
                                    />
                                </td>

                                <td>
                                    <label>
                                        <span>from</span>
                                        &nbsp;
                                        <DateTimeInput 
                                            value    = { row.start }
                                            onChange = { value => handleChange(numRow, 'start', value) }
                                        />
                                        
                                        <input type= "hidden"
                                           name  = {  name + `[items][${numRow}][start]` }
                                           value = { formatters['yyyy-mm-dd hh:ii'](row.start) }
                                           readOnly = { true }
                                        />
                                    </label>

                                    <label>
                                        <span>to</span>
                                        &nbsp;
                                        <DateTimeInput 
                                            value    = { row.end }
                                            onChange = { value => handleChange(numRow, 'end', value) }
                                        />
                                        
                                        <input type= "hidden"
                                            name  = {  name + `[items][${numRow}][end]` }
                                            value = { formatters['yyyy-mm-dd hh:ii'](row.end) }
                                            readOnly = { true }
                                        />
                                    </label>

                                </td>

                                <td>
                                    <button onClick = { e => handleDelete(e, row) }
                                            title = "delete"
                                    >
                                        <TrashIcon width = "12" height = "12" />
                                    </button>
                                </td>

                            </tr>

                        </Fragment>
                    )) }
        
                </tbody>
    
            </table>
            <p>
                <button onClick = { e => handleCreate(e) } >
                    Add event
                </button>
            </p>
        </fieldset>
    )
    
}

export default EventsList
    