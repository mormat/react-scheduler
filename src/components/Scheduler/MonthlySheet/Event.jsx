
import { MonthlySheetDraggable } from '../../../misc/drag-and-drop';

import { createDraggableArea, createDraggableRenderer } from '../../../factories';

import EditEventLink from '../../EventsManager/EditEventLink';

import EditIcon from '../../Widget/EditIcon';

function Event( { value, draggableAreaId, schedulerOptions } ) {
    
    const styles = {
        color: value.color || schedulerOptions.defaultEventColor, 
        backgroundColor: value.bgColor || schedulerOptions.defaultEventBgColor,
        height:     '20px',
        lineHeight: '20px'
    }
    
    const handleDragAndDrop = (e) => {
        
        const parent = e.target.closest('[data-action]');
        const action = parent ? parent.dataset['action'] : 'move';
        
        if (action === 'move') {
            
            e.preventDefault();    
            
            const draggable = new MonthlySheetDraggable(
                value,
                schedulerOptions.onEventUpdate,
                createDraggableArea('#' + draggableAreaId)
            )

            const renderer = createDraggableRenderer('#' + draggableAreaId);

            draggable.startDragAndDrop(e, renderer);
        }
        
    }
    
    return (
        <div 
            className = "mormat-scheduler-Scheduler-MonthlySheet-Event"
            style     = { styles }
            onMouseDown = { handleDragAndDrop }
            data-action = "move"
        >
            <span data-role="header">
                { value.label }
            </span>
            <div data-action="edit" style = { { width : (20 - 4) + 'px' }}>
                <EditEventLink schedulerEvent = {value} schedulerOptions = { schedulerOptions } >
                    <EditIcon width={ 20 - 4 } height= { 20 - 4 } />
                </EditEventLink>
            </div>
        </div>
    )
    
}




export default Event