
import BaseEventContent from './EventContent';

import withEditEvent from '../withEditEvent';
import withDraggableEvent from '../withDraggableEvent';

function EventContainer( { value, droppableId, schedulerOptions } ) {
    
    const styles = {
        color:           value.color, 
        backgroundColor: value.bgColor,
        height:     '20px',
        lineHeight: '20px'
    }
    
    let EventContent = BaseEventContent;
    
    if (schedulerOptions.editable) {
        EventContent = withEditEvent(EventContent, value);    
    }
    
    if (schedulerOptions.draggable) {
        EventContent = withDraggableEvent(EventContent, value, droppableId);
    }
    
    return (
        <div 
            className = "mormat-scheduler-Scheduler-MonthlySheet-EventContainer"
            style     = { styles }
            data-draggable = "timeline"
        >
            <EventContent 
                value = { value } 
                schedulerOptions = { schedulerOptions }
            />
        </div>
    )
    
}




export default EventContainer