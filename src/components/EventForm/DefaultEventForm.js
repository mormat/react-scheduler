
import { useState } from 'react';

import { utils } from '@mormat/jscheduler_ui';

import { withOverlay, withState, withPopup } from './FormDecorators';

import { Button } from './Widgets';

function DefaultEventForm({ 
    labelInput,                
    startInput,
    endInput,
    bgColorInput,
    handleSubmit,
    handleCancel,
    handleDelete,
    translations = {},
    ...otherProps
}) {
 
    console.log('translations', translations);
 
    return (
        <form 
            className = "mormat-scheduler-DefaultEventForm"
            onSubmit  = { handleSubmit }
        >
            <p>
                <label>
                    { translations['form.event_label'] || 'Description' }
                    <br/>
                    { labelInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['form.event_start'] || 'From' }
                    <br/>
                    { startInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['form.event_end'] || 'To' }
                    <br/>
                    { endInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['form.event_bgcolor'] || 'Color' }
                    <br/>
                    { bgColorInput }
                </label>
            </p>

            <p>
                <Button onClick={ handleDelete } variant="danger">
                    { translations['form.delete_btn'] || 'delete' }
                </Button>
                &nbsp;

                <Button type="submit" variant="primary">
                    { translations['form.ok_btn'] || 'ok' }
                </Button>

            </p>
        </form>
    )
    
}


export default withOverlay( withPopup( withState ( 
    DefaultEventForm, 
    { useDatePicker: true, useColorPicker: true} 
) ) );