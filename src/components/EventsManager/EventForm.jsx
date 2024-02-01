
import { useState, useEffect, Fragment } from 'react';

import ColorSelect   from '../Widget/ColorSelect';
import Message       from '../Widget/Message';
import DateTimeInput from '../Widget/DateTimeInput';
import Button        from '../Widget/Button';

const colors = ['#0288d1', '#9575cd', '#0fc4a7', '#721c24', '#856404', '#383d41'];

function EventForm( { schedulerEvent, onConfirm, onDelete } ) {
    
    const [label,   setLabel]   = useState(schedulerEvent.label);
    const [start,   setStart]   = useState(schedulerEvent.start);
    const [end,     setEnd]     = useState(schedulerEvent.end);
    const [bgColor, setBgColor] = useState(colors.includes(schedulerEvent.bgColor) ? schedulerEvent.bgColor : colors.at(0));
    
    const [errors,  setErrors]  = useState([]);
    
    const validate = () => {
        const errors = [];

        if (!label.trim()) {            
            errors.push({'name': 'label', 'text': 'description required'})
        }
        
        if (start > end) {
            errors.push({'name': 'start', 'text': 'invalid date range'})
        }
        
        setErrors(errors);
        return errors;
    }
    
    const handleConfirm = (e) => {
        e.preventDefault();
        
        const errors = validate();
        if (errors.length === 0) {
            const newValues = {
                ...schedulerEvent, label, start, end, bgColor
            }
        
            onConfirm(newValues, schedulerEvent);
        }
    }
    
    const handleDelete = (e) => {
        e.preventDefault();
        
        if (confirm("Deleting event ?")) {
            onDelete(schedulerEvent);
        }
    }
    
    const renderErrors = (name) => (
        <Fragment>
            { errors.filter( e => e.name === name).map( (e, k) => (
                <Message type="error" key = { k }>
                    { e.text }
                </Message>
            )) }
        </Fragment>
    )
    
    return (
        <form className="mormat-scheduler-EventsManager-EventForm" >
            <p> 
                <label>
                    Description
                    <br/>
                    { renderErrors('label') }
                    <input 
                        name     = "label"
                        type     = "text" 
                        value    = { label }
                        onChange = { e => setLabel(e.target.value) }
                    />
                </label>
            </p>
            <p> 
                <label>
                    <span>From</span>
                    <br/>
                    { renderErrors('start') }
                    <DateTimeInput 
                        name     = "start"
                        value    = { start } 
                        onChange = { setStart } 
                    />
                </label>
            </p>
            <p> 
                <label>
                    <span>To</span>
                    <br/>
                    <DateTimeInput 
                        name     = "end"
                        value    = { end } 
                        onChange = { setEnd } 
                    />
                </label>
            </p>
            <p>
                <label>
                    Color
                    <br/>
                    <ColorSelect
                        value    = { bgColor }
                        setValue = { setBgColor }
                        colors = { colors }
                    />
    
                </label>
            </p>
            <div style= { { overflow: 'auto', paddingTop: "5px", paddingBottom: "5px" } }>
                <span style={ { float: 'left' } }>
                    { onDelete && (
                        <Button onClick = { handleDelete } variant = "warning" type="button">
                            Delete
                        </Button>
                    )}
                    
                </span>
                <span style={ { float: 'right' } }>
                    <Button onClick = { handleConfirm } type = "submit" variant = "primary">
                        Ok
                    </Button>
                </span>
            </div>
        </form>
    )
    
}

export default EventForm
    