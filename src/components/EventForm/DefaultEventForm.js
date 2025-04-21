
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
    ...otherProps
}) {
 
    return (
        <form 
            className = "mormat-scheduler-DefaultEventForm"
            onSubmit  = { handleSubmit }
        >
            <p>
                <label>
                    Description<br/>
                    { labelInput }
                </label>
            </p>

            <p>
                <label>
                    From<br/>
                    { startInput }
                </label>
            </p>

            <p>
                <label>
                    To<br/>
                    { endInput }
                </label>
            </p>

            <p>
                <label>
                    Color<br/>
                    { bgColorInput }
                </label>
            </p>

            <p>
                <Button onClick={ handleDelete } variant="danger">
                    delete
                </Button>
                &nbsp;

                <Button type="submit" variant="primary">
                    ok
                </Button>

            </p>
        </form>
    )
    
}


export default withOverlay( withPopup( withState ( 
    DefaultEventForm, 
    { useDatePicker: true, useColorPicker: true} 
) ) );