
import BaseEventContent from './EventContent';

import withEditEvent from '../withEditEvent';
import withDraggableEvent from '../withDraggableEvent';

function EventContainer( { value, draggableAreaId, schedulerOptions } ) {
    
    const styles = {
        color: value.color || schedulerOptions.defaultEventColor, 
        backgroundColor: value.bgColor || schedulerOptions.defaultEventBgColor,
        height:     '20px',
        lineHeight: '20px'
    }
    
    let EventContent = BaseEventContent;
    
    if (schedulerOptions.editable) {
        EventContent = withEditEvent(EventContent, value);    
    }
    
    if (schedulerOptions.draggable) {
        EventContent = withDraggableEvent(EventContent, value, draggableAreaId);
    }
    
    return (
        <div 
            className = "mormat-scheduler-Scheduler-MonthlySheet-EventContainer"
            style     = { styles }
            data-draggable = "monthly-sheet"
        >
            <EventContent 
                value = { value } 
                schedulerOptions = { schedulerOptions }
            />
        </div>
    )
    
}




export default EventContainer