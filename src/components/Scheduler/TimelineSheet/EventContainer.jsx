
import { getDaysBetween, format_date, DateRange } from '../../../utils/date';

import BaseEventContent from './EventContent'

import withEditEvent from '../withEditEvent';
import withDraggableEvent from '../withDraggableEvent';

function EventContainer( { event, index, dateRange, droppableId, schedulerOptions, draggableType}) {
   
    const intersect = dateRange.intersects(event);
    const padding = new DateRange(dateRange.start, new Date(event.start - 1));
    
    const length = intersect.countDays();
    const offset = Math.max(padding.countDays() - 1, 0);
    
    const unit = 100 / dateRange.countDays();
    
    const styles = {
        'right': (100 - (offset + length ) * unit) + '%',
        'left':  (offset * unit) + '%',
        'top':  index * schedulerOptions.spannedEventHeight,
        'display': 'block',
        'position': 'absolute',
        'height': schedulerOptions.spannedEventHeight,
        'color':  event.color,
        backgroundColor: event.bgColor
    }
    
    let EventContent = BaseEventContent;
    
    if (schedulerOptions.editable) {
        EventContent = withEditEvent(EventContent, event);
    }
    
    if (draggableType && schedulerOptions.draggable) {
        EventContent = withDraggableEvent(EventContent, event, droppableId);
    }
    
    return (
        <span 
            className   = "mormat-scheduler-TimelineSheet-EventContainer"
            style       = { styles } 
            data-event-from = { format_date('yyyy-mm-dd hh:ii', event.start) }
            data-draggable  = { draggableType }
        >
            <EventContent 
                event = { event } 
                schedulerOptions = { schedulerOptions } 
            />
        </span>
    )

}

export default EventContainer