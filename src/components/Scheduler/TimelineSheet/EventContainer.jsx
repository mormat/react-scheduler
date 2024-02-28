
import { getDaysBetween, formatters } from '../../../utils/date';

import BaseEventContent from './EventContent'

import withEditEvent from '../withEditEvent';
import withDraggableEvent from '../withDraggableEvent';

function EventContainer( { event, dateRange, draggableAreaId, schedulerOptions, draggableType}) {

    const nbrDays = getDaysBetween(dateRange).length;
    
    const offset  = Math.max(
        getDaysBetween({
            start: dateRange.start, 
            end: event.start}
        ).length - 1,
        0
    );
    
    const length  = Math.min(
        getDaysBetween({
            start: Math.max(event.start, dateRange.start),
            end:  event.end
        }).length,
        nbrDays - offset
    );
    
    const unit = 100 / nbrDays;
    
    const styles = {
        'right': (100 - (offset + length ) * unit) + '%',
        'left':  (offset * unit) + '%',
        'top': 0,
        'display': 'block',
        'position': 'absolute',
        'height': schedulerOptions.spannedEventHeight,
        'color':  event.color || schedulerOptions.defaultEventColor,
        backgroundColor: event.bgColor || schedulerOptions.defaultEventBgColor
    }
    
    let EventContent = BaseEventContent;
    
    if (schedulerOptions.editable) {
        EventContent = withEditEvent(EventContent, event);
    }
    
    if (draggableType && schedulerOptions.draggable) {
        console.log('defaultDraggableType', draggableType);
        EventContent = withDraggableEvent(EventContent, event, draggableAreaId);
    }
    
    return (
        <span 
            className   = "mormat-scheduler-TimelineSheet-EventContainer"
            style       = { styles } 
            data-event-from = { formatters['yyyy-mm-dd hh:ii'](event.start) }
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