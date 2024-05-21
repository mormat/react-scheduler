
import { ElementDraggableArea, CompositeDraggableArea } from './misc/drag-and-drop';

import { getTimelineDragAndDropRenderer, getColumnDragAndDropRenderer } from './misc/renderers';

function createDroppable(droppableId) {
    
    const element = document.getElementById(droppableId);
    const type    = element.getAttribute('data-droppable-type');

    switch (type) {

        case 'day-column': {

            const days = [...element.querySelectorAll('td[data-day]')].map(e => {
                return e.getAttribute('data-day');
            });

            return new CompositeDraggableArea(
                [...new Set(days)].map(d => {
                    return new ElementDraggableArea(
                        `#${droppableId} td[data-day="${d}"]`
                    )
                })      
            )

        }

        case 'timeline': {

            const days = [...element.querySelectorAll('[data-day]')].map(e => {
                return e.getAttribute('data-day');
            });

            return new CompositeDraggableArea(
                [...new Set(days)].map(d => {
                    
                    return new ElementDraggableArea(
                        `#${droppableId} [data-day="${d}"]`
                    );
                    
                })
            )
        }
    }
    
}

function createDragAndDropRenderer(droppableId) {
    
    const element = document.getElementById(droppableId);
    const type    = element.getAttribute('data-droppable-type');
    
    switch (type) {

        case 'day-column': 
        
            return getColumnDragAndDropRenderer();

        case 'timeline':

            return getTimelineDragAndDropRenderer();
        
    }
    
}

export { createDroppable, createDragAndDropRenderer }