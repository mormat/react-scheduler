
import { useState } from 'react';
import { withOverlay } from '../Layout';

import { utils } from '@mormat/jscheduler_ui';
import { useUniqueId } from '@src/utils/hooks';

function BootstrapEventForm( { values = {}, onConfirm, onCancel, onDelete }) {
    
    const [label, setLabel ] = useState( values.label || '');
    const [start, setStart ] = useState(
        values.start ?
        utils.format_date('yyyy-mm-dd hh:ii', values.start):
        ''
    );
    const [end,   setEnd ]  = useState(
        values.end ?
        utils.format_date('yyyy-mm-dd hh:ii', values.end):
        ''        
    );
    const [bgColor, setBgColor] = useState(values.bgColor || 'lightgray');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onConfirm) {
            onConfirm({label, start, end, bgColor});
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
        <div className="card rounded-0 mormat-scheduler-BootstrapEventForm">
            <div className="card-header">
                <strong>
                    Edit event
                </strong>
                
                <button type="button" 
                    className="btn-close float-end" 
                    aria-label="Close"
                    onClick={ handleCancel }
                ></button>
            </div>
            <div className="card-body">
              <form onSubmit = { handleSubmit }>
              
                <div className="row">
                    <div className="col-8">
                    
                        <FormRow label="label" 
                            value={ label } 
                            setValue = { setLabel } 
                            type = "text" 
                            required = { true }
                        />

                        <FormRow 
                            label="Start" 
                            value={ start } 
                            setValue = { setStart } 
                            type = "datetime-local" 
                            required = { true }
                        />

                        <FormRow 
                            label="End" 
                            value={ end } 
                            setValue = { setEnd } 
                            type = "datetime-local" 
                            required = { true }
                        />

                        <FormRow 
                            label="Background color" 
                            value={ bgColor } 
                            setValue = { setBgColor } 
                            type = "color" 
                        />
                        
                    </div>
                    <div className="col-4">
                        <div className="vstack gap-3 h-100 position-relative">
                            <div>
                                <button  href="#" 
                                    className="btn btn-primary rounded-0 w-100"
                                    type="submit"
                                >
                                  OK
                                </button>
                            </div>
                            <div>
                                <a href="#" 
                                    className="btn btn-secondary rounded-0 w-100"
                                    onClick={ handleCancel }
                                 >
                                   Cancel
                                 </a>
                            </div>
                            <div style= {{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                <a href="#" 
                                    className="btn btn-danger rounded-0 w-100"
                                    onClick={ handleDelete }
                                >
                                Delete
                                </a>
                            </div>
                        </div>
                        
                    </div>
                </div>
              
              </form>
              
            </div>
          </div>
    )
    
}

function FormRow( { value, setValue, label, type, ...otherProps  } ) {
    
    const uniqueId = useUniqueId();
    
    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }
    
    return (
        <div className="mb-3">
            <label htmlFor={ uniqueId } className="form-label">
                { label }
            </label>
            <input id={ uniqueId }
                   className="form-control"  
                   type = { type }
                   value = { value }
                   onChange = { handleChange }
                   { ...otherProps }
            />
        </div>
    )
}


export default withOverlay(BootstrapEventForm)
    