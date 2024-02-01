
import { getDaysBetween } from '../../../utils/date';

import { MonthlySheetDraggable } from '../../../misc/drag-and-drop';

import { createDraggableArea, createDraggableRenderer } from '../../../factories';

import EditEventLink from '../../EventsManager/EditEventLink';

import EditIcon from '../../Widget/EditIcon';

function Event( { event, dateRange, draggableAreaId, schedulerOptions }) {

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
    
    // styles['border'] = '2px solid transparent';
    
    const handleDragAndDrop = (e, event) => {
        
        if (!draggableAreaId) {
            return;
        }
        
        const parent = e.target.closest('[data-action]');
        const action = parent ? parent.dataset['action'] : 'move';
        
        if (action === 'move') {
            const draggable = new MonthlySheetDraggable(
                event,
                schedulerOptions.onEventUpdate,
                createDraggableArea('#' + draggableAreaId)
            )

            const renderer = createDraggableRenderer('#' + draggableAreaId);

            draggable.startDragAndDrop(e, renderer);
        }
        
    }
    
    return (
        <span 
            className   = "mormat-scheduler-TimelineSheet-Event"
            style       = { styles } 
            onMouseDown = { e => handleDragAndDrop(e, event) }
            data-action = "move"
        >
            <span data-role="header">
                { event.label }
            </span>
                    
            <div data-action="edit">
                <EditEventLink schedulerEvent = { event } schedulerOptions = { schedulerOptions } >
                    <EditIcon width={ 20 - 4 } height= { 20 - 4 } />
                </EditEventLink>
            </div>    
        </span>
    )

}

export default Event