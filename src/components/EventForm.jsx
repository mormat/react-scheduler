import DefaultEventForm   from './EventForm/DefaultEventForm';
import BootstrapEventForm from './EventForm/BootstrapEventForm';
import OkCancelDialog     from './EventForm/OkCancelDialog';

import { useState, useMemo } from 'react';

function withEventForm(WrappedComponent, EventForm) {
    
    return function(props) {
        const [schedulerEvent, setSchedulerEvent] = useState();
        const [isEventAdd, setEventAdd] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
        const scheduler = useMemo(() => {

            const handleEventAdd = function(schedulerEvent) {
                setSchedulerEvent(schedulerEvent);
                setEventAdd(true);
            }
            
            const handleEventEdit = function(schedulerEvent) {
                setSchedulerEvent(schedulerEvent);
                setEventAdd(false);
            }

            return ( 
                <WrappedComponent 
                    onEventAdd  = { handleEventAdd } 
                    onEventEdit = { handleEventEdit } 
                    { ...props }
                /> 
            );

        }, [setSchedulerEvent]);

        return <>
            { scheduler }
            { schedulerEvent && (
                <EventForm 
                    values = { isEventAdd ? {} : schedulerEvent.values}
                    onConfirm = { (values) => {
                        schedulerEvent.update(values);
                        setSchedulerEvent(null);
                        if (isEventAdd && props.onEventCreate) {
                            props.onEventCreate(schedulerEvent.values);
                        }
                        
                        if (!isEventAdd && props.onEventUpdate) {
                            props.onEventUpdate(schedulerEvent.values);
                        }
                    }}
                    onCancel = { () => {
                        setSchedulerEvent(null);
                    }}
                    onDelete = { () => {
                        setShowDeleteConfirm(true);
                    }}
                    translations = { props.translations }
                />
            ) }
            { showDeleteConfirm && (
                <OkCancelDialog 
                    message = { 
                        ( 
                            (props.translations || {})['msg.confirm_delete'] ||
                            "Delete the '$event_label' event ?"
                        ).replace('$event_label', schedulerEvent.label)
                    }
                    onConfirm = { () => {
                        schedulerEvent.delete();
                        setSchedulerEvent(null);
                        if (props.onEventDelete) {
                            props.onEventDelete(schedulerEvent.values);
                        }
                        setShowDeleteConfirm(false);
                    }}
                    onCancel = { () => {
                        setShowDeleteConfirm(false);
                    }}                
                    translations = { props.translations }
                />
            ) }
        </>;
    }
    
    
}

export default DefaultEventForm;
export { 
    withEventForm,
    DefaultEventForm, 
    BootstrapEventForm, 
    OkCancelDialog 
};
