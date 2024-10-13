
import { useState } from 'react';

import { utils } from '@mormat/jscheduler_ui';

import { withOverlay } from './Layout';

function EventForm({ values = {}, onConfirm, onCancel, onDelete }) {
    
    const [label, setLabel] = useState(values.label || '');
    const [start, setStart] = useState(
        values.start ?
        utils.format_date('yyyy-mm-dd hh:ii', values.start):
        ''
    );
    const [end,   setEnd]   = useState(
        values.end ?
        utils.format_date('yyyy-mm-dd hh:ii', values.end):
        ''        
    );
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onConfirm) {
            onConfirm({label, start, end});
        }
    }
    
    const handleCancel = (e) => {
        e.preventDefault();
        if (onCancel) {
            onCancel();
        }
    }
    
    const handleDelete = (e) => {
        e.preventDefault();
        if (onDelete) {
            onDelete();
        }
    }
    
    return (
        <div className="mormat-scheduler-EventForm">
            <form onSubmit = { handleSubmit }>
                <p>
                    <label>
                        label<br/>
                        <input
                            type="text"
                            required= { true }
                            value={ label }                        
                            onChange={ e => setLabel(e.target.value) }
                        />
                    </label>
                </p>

                <p>
                    <label>
                        start<br/>
                        <input
                            type="datetime-local"
                            required= { true }
                            value={ start }
                            onChange={ e => setStart(e.target.value) }
                        />
                    </label>
                </p>

                <p>
                    <label>
                        end<br/>
                        <input
                            type="datetime-local"
                            required = { true }
                            value ={ end }
                            onChange ={ e => setEnd(e.target.value) }
                        />
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



export default withOverlay(EventForm)