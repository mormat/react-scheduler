
import { MonthlySheetDraggable } from '../../misc/drag-and-drop';

import { MoveEventDraggable, ResizeEventDraggable } from '../../misc/drag-and-drop';

import { createDraggableArea, createDraggableRenderer } from '../../factories';

function withDraggableEvent(WrappedComponent, value, draggableAreaId)
{
    
    const createDraggable = (draggableType, onChange) => {

        const area = createDraggableArea('#' + draggableAreaId);

        if (draggableType === 'monthly-sheet') {
            return new MonthlySheetDraggable(value, onChange, area);
        }

        if (draggableType === 'move-event') {
            return new MoveEventDraggable(value, onChange, area);
        }

        if (draggableType === 'resize-event') {
            return new ResizeEventDraggable(value, onChange, area);
        }
    }
    
    return function( { schedulerOptions, ...otherProps} )
    {
        
        const updateEvent = (value, previous) => {
            schedulerOptions.onEventUpdate(value, { previous });
        }
        
        const handleDragAndDrop = (e) => {
        
            const parent = e.target.closest('[data-draggable]');
            
            const draggable = createDraggable( 
                parent.dataset['draggable'], 
                updateEvent
            );
            
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