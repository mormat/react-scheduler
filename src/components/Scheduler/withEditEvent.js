
import { useState } from 'react';

import EditIcon from '../Widget/EditIcon';

import BaseEventForm from '../EventsManager/EventForm';

import withPopup from '../Widget/withPopup';

function withEditEvent(WrappedComponent, value)
{
    return function( { schedulerOptions, ...otherProps} )
    {
        const [ formValues, setFormValues ] = useState();
        
        const EventForm = withPopup(BaseEventForm, () => setFormValues(null));
        
        const handleEditEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();

            setFormValues(value);
        }
        
        const handleConfirmForm = (v) => {
            schedulerOptions.onEventUpdate(v, { previous: value });

            setFormValues(null);
        }
        
        const handleDeleteForm = (v) => {
            schedulerOptions.onEventDelete(v);
            
            setFormValues(null);
        }
        
        return (
            <div className="mormat-scheduler-Scheduler-withEditEvent">
    
                <a  onClick = { handleEditEvent } 
                    title   = 'Edit event'
                    data-draggable = "none"
                >
                    <EditIcon width={ 20 - 4 } height= { 20 - 4 } />
                    
                </a>
                
                { formValues && (
                    <div data-draggable = "none">
                        <EventForm 
                             schedulerEvent = { formValues }
                             onConfirm      = { handleConfirmForm }
                             onDelete       = { handleDeleteForm }
                         />   
                     </div>
                ) }
    
                <WrappedComponent 
                    { ...otherProps } 
                    schedulerOptions = { schedulerOptions }
                />
            </div>
        )
    }
}

export default withEditEvent;