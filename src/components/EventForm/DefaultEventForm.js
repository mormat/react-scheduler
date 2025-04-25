
import { useState } from 'react';

import { utils } from '@mormat/jscheduler_ui';

import { withOverlay, withState, withPopup } from './FormDecorators';

import { Button, Message } from './Widgets';

function DefaultEventForm({ 
    labelInput,                
    startInput,
    endInput,
    bgColorInput,
    handleSubmit,
    handleCancel,
    handleDelete,
    values,
    translations = {},
    ...otherProps
}) {
 
    const [errors, setErrors] = useState([]);
 
    const onSubmit = (e) => {
        e.preventDefault();
        const errors = [];
        
        if (!values['label']) {
            errors.push({
                field : 'event_desc',
                text  : translations['event_desc_required_msg'] ||
                        "description required",
            });
        }
        
        if (values['start'] > values['end']) {
            errors.push({
                field : 'event_start',
                text  : translations['event_invalid_daterange_msg'] ||
                        "invalid date range",
            });
        }
        
        setErrors(errors);
        
        if (errors.length === 0) {
            handleSubmit(e);
        }
    }
 
    function render_error(field) {
        return errors.filter(
            e => e.field === field
        ).map((error, n) => (
            <span key={n} >
                <Message variant="danger">
                    { error.text }
                </Message>
                <br/>
            </span>
        ))
    }
 
    return (
        <form 
            className = "mormat-scheduler-DefaultEventForm"
            onSubmit  = { onSubmit }
        >
            <p>
                <label>
                    { translations['event_desc_label'] || 'Description' }
                    <br/>
                    { render_error('event_desc') }
                    { labelInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['event_start_label'] || 'From' }
                    <br/>
                    { render_error('event_start') }
                    { startInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['event_end_label'] || 'To' }
                    <br/>
                    { endInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['event_bgcolor_label'] || 'Color' }
                    <br/>
                    { bgColorInput }
                </label>
            </p>

            <p>
                { handleDelete && (
                    <Button onClick={ handleDelete } variant="danger">
                        { translations['delete_btn'] || 'delete' }
                    </Button>
                ) }
                &nbsp;

                <Button type="submit" variant="primary">
                    { translations['ok_btn'] || 'ok' }
                </Button>

            </p>
        </form>
    )
    
}


export default withOverlay( withPopup( withState ( 
    DefaultEventForm, 
    { useDatePicker: true, useColorPicker: true} 
) ) );