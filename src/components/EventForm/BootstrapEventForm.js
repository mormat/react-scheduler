
import { withOverlay, withState } from './FormDecorators';

import { useUniqueId } from '@src/utils/hooks';

import { InputPropsContext } from './Contexts';

function BootstrapEventForm( { 
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
        <div className="mormat-scheduler-BootstrapEventForm card rounded-0">
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

                        <FormRow 
                            label="Label" 
                            input={ labelInput } 
                        />
                        
                        <FormRow 
                            label="Start" 
                            input={ startInput } 
                        />
                        
                        <FormRow 
                            label="End"   
                            input={ endInput } 
                        />
                        
                        <FormRow 
                            label="Background color" 
                            input={ bgColorInput } 
                        />

                    </div>
                    <div className="col-4">
                        <div className="vstack gap-3 h-100 position-relative">
                            
                            <Button variant="primary" 
                                    type="submit"
                                    className="mormat-scheduler-btnConfirmEvent"
                            >
                                OK
                            </Button>
                            
                            <Button variant="secondary" onClick={ handleCancel } >
                                Cancel
                            </Button>
                            
                            <div style= {{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                <Button variant="danger" onClick={ handleDelete } >
                                    Delete
                                </Button>
                            </div>
                            
                        </div>

                    </div>
                </div>

              </form>

            </div>
          </div>
    )
    
}

function FormRow( { label, input }) {
    
    const uniqueId = useUniqueId();
    
    const inputProps = {
        id: uniqueId,
        className: "form-control"
    }
    
    return (
        <InputPropsContext.Provider value={ inputProps }>
            <div className="mb-3">
                <label htmlFor={ uniqueId } className="form-label">
                    { label }
                </label>
                { input }
            </div>
        </InputPropsContext.Provider>
    )
    
}

function Button( { variant = 'primary', children, ...otherProps }) {
    return (
        <button
            className={ `btn btn-${variant} rounded-0 w-100` }
            { ...otherProps }
        >
            { children }
        </button>        
    )
}

export default withOverlay( withState( BootstrapEventForm ) )
    