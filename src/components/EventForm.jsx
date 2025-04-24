import DefaultEventForm   from './EventForm/DefaultEventForm';
import BootstrapEventForm from './EventForm/BootstrapEventForm';
import OkCancelDialog     from './EventForm/OkCancelDialog';

import { useState, useMemo } from 'react';

function withEventForm(WrappedComponent, EventForm) {
    
    return function(props) {
        
        const [schedulerEvent, setSchedulerEvent] = useState();
        const [rawScheduler,   setRawScheduler]   = useState();
        const [isEventAdd, setEventAdd] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
        const scheduler = useMemo(() => {

            const handleEventAdd = function(schedulerEvent, rawScheduler) {
                setSchedulerEvent(schedulerEvent);
                setRawScheduler(rawScheduler);
                setEventAdd(true);
            }
            
            const handleEventEdit = function(schedulerEvent, rawScheduler) {
                setSchedulerEvent(schedulerEvent);
                setRawScheduler(rawScheduler);
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
                        if (isEventAdd) {
                            rawScheduler.pushEvent(values);
                        } else {
                            rawScheduler.replaceEvent(
                                values, 
                                i => schedulerEvent.values.id === i.id
                            );
                        }
                        
                        const options = {
                            valuesBefore: schedulerEvent.values,
                            scheduler: rawScheduler
                        }
                        
                        if (isEventAdd && props.onEventCreate) {
                            props.onEventCreate(values, options);
                        }
                        if (!isEventAdd && props.onEventUpdate) {
                            props.onEventUpdate(values, options);
                        }
                        
                        setSchedulerEvent(null);
                    }}
                    onCancel = { () => {
                        setSchedulerEvent(null);
                    }}
                    onDelete = { 
                        isEventAdd ?
                        null :
                        function() { setShowDeleteConfirm(true) }
                    }
                    translations = { props.translations }
                    dateLocale = { props.dateLocale }
                />
            ) }
            { showDeleteConfirm && (
                <OkCancelDialog 
                    message = { 
                        ( 
                            (props.translations || {})['delete_event_confirm_msg'] ||
                            "Delete the '$event_label' event ?"
                        ).replace('%event_label%', schedulerEvent.label)
                    }
                    onConfirm = { () => {
                        rawScheduler.removeEvent(
                            i => schedulerEvent.values.id === i.id
                        )
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
