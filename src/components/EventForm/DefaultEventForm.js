
import { useState } from 'react';

import { utils } from '@mormat/jscheduler_ui';

import { withOverlay, withState } from './Decorators';

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
        <div className="mormat-scheduler-DefaultEventForm">
            <form onSubmit = { handleSubmit }>
                <p>
                    <label>
                        label<br/>
                        { labelInput }
                    </label>
                </p>

                <p>
                    <label>
                        start<br/>
                        { startInput }
                    </label>
                </p>

                <p>
                    <label>
                        end<br/>
                        { endInput }
                    </label>
                </p>

                <p>
                    <button type="submit">
                        ok
                    </button>
                    &nbsp;
                    <button onClick={ handleCancel }>
                        cancel
                    </button>
                    
                    <button onClick={ handleDelete } style = {{ float: 'right'}}>
                        delete
                    </button>
                </p>
            </form>
        </div>
    )
    
}

export default withOverlay( withState( DefaultEventForm ) )