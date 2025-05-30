import DefaultEventForm   from './EventForm/DefaultEventForm';
import BootstrapEventForm from './EventForm/BootstrapEventForm';
import OkCancelDialog     from './EventForm/OkCancelDialog';

import { utils } from '@mormat/jscheduler_ui';

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
                    values = { isEventAdd ? {} : schedulerEvent}
                    onConfirm = { (values) => {
                        let eventId;
                        
                        if (isEventAdd) {
                            const { _uuid } = rawScheduler.pushEvent(values);
                            eventId = _uuid;
                        } else {
                            eventId = schedulerEvent._uuid; 
                            rawScheduler.replaceEvent(
                                values, 
                                i => eventId === i._uuid
                            );
                        }
                        
                        const options = {
                            valuesBefore: schedulerEvent,
                            scheduler: rawScheduler
                        }
                        
                        if (isEventAdd && props.onEventCreate) {
                            const setValues = function(newValues) {
                                rawScheduler.replaceEvent(
                                    newValues, 
                                    i => eventId === i._uuid
                                )
                            }
                            props.onEventCreate(
                                values, 
                                { ...options, setValues }
                            );
                        }
                        if (!isEventAdd && props.onEventUpdate) {
                            const setValues = function(newValues) {
                                rawScheduler.replaceEvent(
                                    newValues, 
                                    i => eventId === i._uuid
                                )
                            }
                            props.onEventUpdate(
                                { ...schedulerEvent, ...values }, 
                                { setValues, ...options }
                            );
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
                            i => schedulerEvent._uuid === i._uuid
                        )
                        setSchedulerEvent(null);
                        if (props.onEventDelete) {
                            
                            const cleanedValues = { ...schedulerEvent }
                            for (const k of ['start', 'end']) {
                                cleanedValues[k] = utils.format_date(
                                    'yyyy-mm-dd hh:ii',
                                    cleanedValues[k]
                                );
                            }
                            
                            const undoDelete = function() {
                                rawScheduler.pushEvent( cleanedValues );
                            }
                            
                            props.onEventDelete(cleanedValues, { undoDelete });
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
