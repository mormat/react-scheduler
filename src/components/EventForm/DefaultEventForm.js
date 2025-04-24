
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
 
    return (
        <form 
            className = "mormat-scheduler-DefaultEventForm"
            onSubmit  = { handleSubmit }
        >
            <p>
                <label>
                    { translations['event_desc_label'] || 'Description' }
                    <br/>
                    { labelInput }
                </label>
            </p>

            <p>
                <label>
                    { translations['event_start_label'] || 'From' }
                    <br/>
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