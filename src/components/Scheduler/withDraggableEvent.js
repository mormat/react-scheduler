
import { MonthlySheetDraggable } from '../../misc/drag-and-drop';

import { MoveEventDraggable, ResizeEventDraggable } from '../../misc/drag-and-drop';

import { createDraggableArea, createDraggableRenderer } from '../../factories';

function withDraggableEvent(WrappedComponent, value, draggableAreaId)
{
    
    return function( { schedulerOptions, ...otherProps} )
    {
        
        const createDraggable = (draggableType) => {
            
            if (draggableType === 'monthly-sheet') {
                return new MonthlySheetDraggable(
                    value,
                    schedulerOptions.onEventUpdate,
                    createDraggableArea('#' + draggableAreaId)
                )
            }
            
            if (draggableType === 'move-event') {
                return new MoveEventDraggable(
                    value,
                    schedulerOptions.onEventUpdate,
                    createDraggableArea('#' + draggableAreaId)
                )
            }
            
            if (draggableType === 'resize-event') {
                return new ResizeEventDraggable(
                    value,
                    schedulerOptions.onEventUpdate,
                    createDraggableArea('#' + draggableAreaId)
                )
            }
            
        }
        
        const handleDragAndDrop = (e) => {
        
            const parent = e.target.closest('[data-draggable]');
            
            const draggable = createDraggable(parent.dataset['draggable']);
            
            if (draggable) {
                
                e.preventDefault();
                
                const renderer = createDraggableRenderer('#' + draggableAreaId);
                
                draggable.startDragAndDrop(e, renderer);
            }

        }
        
        return (
            <div className="mormat-scheduler-Scheduler-withDraggableEvent"
                 onMouseDown    = { handleDragAndDrop }
            >
                <WrappedComponent 
                    { ...otherProps } 
                    schedulerOptions = { schedulerOptions }
                />
            </div>
        )
    }
}

export default withDraggableEvent;