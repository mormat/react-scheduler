
import { useEffect, useState } from 'react';

import { getClassName } from '../../../utils/dom';

import { formatters, getPercentInDateRange } from '../../../utils/date';

import { MoveEventDraggable, ResizeEventDraggable } from '../../../misc/drag-and-drop';

import { createDraggableArea, createDraggableRenderer } from '../../../factories';

import EditEventLink from '../../EventsManager/EditEventLink';

import EditIcon from '../../Widget/EditIcon';

function Event( { value, constraint, draggableAreaId, schedulerOptions, offset } ) {
    
    const getStyles = () => {
                
        const topPercent    = getPercentInDateRange(value.start, constraint);
        const bottomPercent = 1 - getPercentInDateRange(value.end, constraint);
        
        return {
            top:    (topPercent * 100) + '%',
            bottom: (bottomPercent * 100) + '%',
            width:  (100 / offset.length) + '%',
            left:   ((100 /offset.length) * offset.current) + '%',
            color: value.color || schedulerOptions.defaultEventColor,
            backgroundColor: value.bgColor || schedulerOptions.defaultEventBgColor
        }
        
    }
    
    const handleDragAndDrop = (e) => {
        
        const parent = e.target.closest('[data-action]');
        const action = parent ? parent.dataset['action'] : 'move';
        
        if (action === 'resize') {
            
            const draggable = new ResizeEventDraggable(
                value, 
                schedulerOptions.onEventUpdate,
                createDraggableArea('#' + draggableAreaId)
            );
    
            const renderer = createDraggableRenderer('#' + draggableAreaId);
    
            draggable.startDragAndDrop(e, renderer);
        } 
        
        if (action === 'move') {
            
            const draggable = new MoveEventDraggable(
                value, 
                schedulerOptions.onEventUpdate,
                createDraggableArea('#' + draggableAreaId)
            );
    
            const renderer = createDraggableRenderer('#' + draggableAreaId);
    
            draggable.startDragAndDrop(e, renderer);
        }
        
    }
    
    return (
        <div 
            className = { getClassName('Scheduler-DailyColumnsSheet-Event') }
            style     = { getStyles() }
            onMouseDown = { handleDragAndDrop }
            data-action = "move"
        >
            <div data-role="header">  
                <span data-type="hour">
                    { formatters['hh:ii'](value.start) }
                </span>
                
                &nbsp;-&nbsp;
                <span data-type="hour">
                    { formatters['hh:ii'](value.end) }
                </span>
                
                <div data-action="edit">
                    <EditEventLink schedulerEvent = { value } schedulerOptions = { schedulerOptions } >
                        <EditIcon width="16" height="16" />
                    </EditEventLink>
                </div>
            </div>
            <div data-role = "content">
                { value.label }
            </div>
            <div data-action="resize" />
            
        </div>
    )
    
}

export default Event