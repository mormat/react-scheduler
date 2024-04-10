
import { ElementDraggableArea, CompositeDraggableArea } from './misc/drag-and-drop';

import { MonthlySheetDraggableRenderer, DayColumnDraggableRenderer } from './misc/renderers';

function createDraggableArea(selector) {
    
    const element = document.querySelector(selector);
    const type    = element.getAttribute('data-draggable-area-type');

    switch (type) {

        case 'day-column': {

            const days = [...element.querySelectorAll('td[data-day]')].map(e => {
                return e.getAttribute('data-day');
            });

            return new CompositeDraggableArea(
                [...new Set(days)].map(d => {
                    return new ElementDraggableArea(
                        `${selector} td[data-day="${d}"]`
                    )
                })      
            )

        }

        case 'monthly_sheet': {

            const days = [...element.querySelectorAll('[data-day]')].map(e => {
                return e.getAttribute('data-day');
            });

            return new CompositeDraggableArea(
                [...new Set(days)].map(d => {
                    
                    return new ElementDraggableArea(
                        `${selector} [data-day="${d}"]`
                    );
                    
                    /*
                    return new CompositeDraggableArea([
                        new ElementDraggableArea(
                            `${selector} [data-day="${d}"][data-role="header"]`
                        ),
                        new ElementDraggableArea(
                            `${selector} [data-day="${d}"][data-role="content"]`
                        )
                    ]);
                     */
                    
                })
            )
        }
    }
    
}

function createDraggableRenderer(selector) {
    
    const element = document.querySelector(selector);
    const type    = element.getAttribute('data-draggable-area-type');
    
    switch (type) {

        case 'day-column': 
        
            return DayColumnDraggableRenderer();

        case 'monthly_sheet':

            return MonthlySheetDraggableRenderer();
        
    }
    
}

export { createDraggableArea, createDraggableRenderer }