
import { useState, useEffect, Fragment } from 'react';

import { DateTimePicker } from '../Widget/Form/DateTimePicker';
import ColorPicker   from '../Widget/Form/ColorPicker';
import TrashIcon from '../Widget/TrashIcon';
import Message   from '../Widget/Message';

import TextInput from '../Widget/Form/TextInput';

import { defaultSchedulerConfig } from '../Scheduler';

import { format_date } from '../../utils/date';
import { parseString } from '../../utils/csv';
import { createSchedulerEvent } from '../../models/events';

import { useUniqueId } from '../../utils/dom';

const colors = ['#0288d1', '#9575cd', '#0fc4a7', '#721c24', '#856404', '#383d41'];

function EventsList( { value, onChange, name } ) {
    
    const [rows, setRows] = useState(() => {
        const items = parseString(value || '').map(obj => ({ 
            bgColor: defaultSchedulerConfig.defaultEventBgColor,
            ...createSchedulerEvent(obj) 
        }));
        return items.map(({start, end, ...otherProps}) => ({
            start: format_date('yyyy-mm-dd hh:ii', start),
            end:   format_date('yyyy-mm-dd hh:ii', end),
            ...otherProps
        }))
    });
    
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
            start:   format_date('yyyy-mm-dd hh:ii', Date.now()),
            end:     format_date('yyyy-mm-dd hh:ii', Date.now() + 60 * 60 * 1000),
            bgColor: colors[0]
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
    
    useEffect(() => {
        const headers = ['label', 'start', 'end', 'bgColor', 'errors'];
        const lines   = rows.map(row => ([
            row['label'],
            row['start'],
            row['end'],
            row['bgColor'],
            getErrors(row).join(',')
        ]));

        const value = [headers, ...lines].map(l => l.join('\t')).join('\n');
        onChange(value);
    }, [rows]);
    
    return (
        <fieldset className="mormat-scheduler-EventsManager-EventsList">
        
            <textarea 
                name     = { name } 
                value    = { value }
                readOnly = { true }
                cols     = "70"
                rows     = "10"
            />
            
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
                                                value = { numRow + 1 }
                                            />
                                            <input 
                                                type  = "hidden"
                                                value = { error }
                                            />
                                        </Fragment>
                                    )) }
                                
                                </td>
                            
                            </tr>

                            <tr data-nth-event = { numRow + 1 } >

                                <td>
                                
                                    <TextInput 
                                        value = { row.label }
                                        label = "label"
                                        size  = "30"
                                        onChange = { v => handleChange(numRow, 'label', v) }
                                        decorators = {{'label': () => {}}}
                                        required = { true }
                                    />
                                
                                </td>

                                <td rowSpan="2">
                                    <DateTimePicker 
                                        value    = { row.start }
                                        onChange = { value => handleChange(numRow, 'start', value) }
                                        label    = "from"
                                    />
                                    <input type= "hidden"
                                       value = { row.start }
                                       readOnly = { true }
                                    />
                                    <br/>
                                    <DateTimePicker 
                                        value    = { row.end }
                                        onChange = { value => handleChange(numRow, 'end', value) }
                                        label  = "to"
                                    />

                                    <input type= "hidden"
                                        value = { row.end }
                                        readOnly = { true }
                                    />
                                </td>

                                <td rowSpan="2">
                                    <button onClick = { e => handleDelete(e, row) }
                                            title = "Remove event"
                                            className = "button"
                                    >
                                        <TrashIcon width = "12" height = "12" />
                                    </button>
                                </td>

                            </tr>
                            
                            <tr data-nth-event = { numRow + 1 }>
                            
                                <td>
                                    <ColorPicker 
                                        value    = { row.bgColor }
                                        onChange = { value => handleChange(numRow, 'bgColor', value) }
                                        label    = "color"
                                        colors   = { colors }
                                        decorators = {{'label': () => {}}}
                                    />
                                </td>
                            
                            </tr>

                        </Fragment>
                    )) }
        
                </tbody>
    
            </table>
            <p>
                <button onClick = { e => handleCreate(e) } 
                        className="button">
                    Add event
                </button>
            </p>
        </fieldset>
    )
    
}

export default EventsList
    