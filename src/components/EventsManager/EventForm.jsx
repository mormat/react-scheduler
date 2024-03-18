
import { useState, useEffect, Fragment } from 'react';

import TextInput      from '../Widget/Form/TextInput';
import DateTimePicker from '../Widget/Form/DateTimePicker';
import ColorPicker    from '../Widget/Form/ColorPicker';
import Message        from '../Widget/Message';
import Button         from '../Widget/Button';

const colors = ['#0288d1', '#9575cd', '#0fc4a7', '#721c24', '#856404', '#383d41'];

function EventForm( { schedulerEvent, onConfirm, onDelete } ) {
    
    const [label,   setLabel]   = useState(schedulerEvent.label);
    const [start,   setStart]   = useState(schedulerEvent.start);
    const [end,     setEnd]     = useState(schedulerEvent.end);
    const [bgColor, setBgColor] = useState(
        colors.includes(schedulerEvent.bgColor) ? schedulerEvent.bgColor : colors.at(0)
    );
    
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
    
    const decorators = {
        'label': (subject, name) => (
            <Fragment>
                { subject }
                <br/>
                { renderErrors(name) }
            </Fragment>
        )
    }
    
    return (
        <form className="mormat-scheduler-EventsManager-EventForm" >
            <p> 
                <label>
                    <TextInput
                        label    = "Description"
                        name     = "label"
                        value    = { label }
                        onChange = { setLabel }
                        decorators = { decorators }
                    />
                </label>
            </p>
            <p> 
                <DateTimePicker 
                    value      = { start } 
                    onChange   = { setStart } 
                    name       = "start"
                    label      = "From"
                    decorators = { decorators }
                />
            </p>
            <p> 
                <DateTimePicker 
                    value      = { end } 
                    onChange   = { setEnd } 
                    name       = "end"
                    label      = "To"
                    decorators = { decorators }
                />
            </p>
            <p>                
                <ColorPicker
                    value      = { bgColor }
                    onChange   = { setBgColor }
                    name       = "bgColor"
                    label      = "Color"
                    colors     = { colors }
                    decorators = { decorators }
                />
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
    