
import { useState, Fragment } from 'react';

import BaseEventForm from './EventForm';

import withPopup from '../Widget/withPopup';

function EditEventLink( { children, schedulerEvent, schedulerOptions }  ) {
    
    const [ formValues, setFormValues ] = useState();
    
    const EventForm = withPopup(BaseEventForm, () => setFormValues(null));
    
    const handleEditEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setFormValues(schedulerEvent);
    }
        
    const handleConfirmForm = (v) => {
        schedulerOptions.onEventUpdate(v, formValues);
            
        setFormValues(null);
    }
    
    const handleDeleteForm = (v) => {
        schedulerOptions.onEventDelete(v);
            
        setFormValues(null);
    }
    
    return (
        <Fragment>
            <a  onClick = { handleEditEvent } 
                title   = 'Edit event'
                className="mormat-scheduler-EventsManager-EditEventLink">
                { children }
            </a>
            { formValues && (
               <EventForm 
                    schedulerEvent = { formValues }
                    onConfirm      = { handleConfirmForm }
                    onDelete       = { handleDeleteForm }
                />   
            ) }
        </Fragment>
    )
    
}

export default EditEventLink