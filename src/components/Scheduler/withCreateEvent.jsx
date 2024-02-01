
import { useState } from 'react';

import BaseEventForm from '../EventsManager/EventForm';

import withPopup from '../Widget/withPopup';

import PlusIcon from '../Widget/PlusIcon'

function withCreateEvent( WrappedComponent ) {
    
    return function( { schedulerOptions, ...otherProps} ) {
    
        const [formValues, setFormValues] = useState();

        const EventForm = withPopup(BaseEventForm, () => setFormValues(null));
        
        const handleClickAddEvent = (e) => {
            e.preventDefault();

            setFormValues({
                label: '',
                start: new Date(Date.now()),
                end: new Date(Date.now() + 60 * 60 * 1000)
            });
        }
        
            
        const handleConfirmForm = (v) => {
            schedulerOptions.onEventCreate(v, formValues);
            
            setFormValues(null);
        }
        
        return (
            <div className="mormat-scheduler-Scheduler-withCreateEvent">
                
                <a onClick={ handleClickAddEvent } title="Add event">
                    <PlusIcon width="24" height="24" />
                </a>
                
                <WrappedComponent 
                    { ...otherProps } 
                    schedulerOptions = { schedulerOptions }
                />
                
                { formValues && (
                    <EventForm 
                        schedulerEvent = { formValues } 
                        onConfirm = { handleConfirmForm }
                    />
                )}
            </div>
        )
    }
    
}

export default withCreateEvent