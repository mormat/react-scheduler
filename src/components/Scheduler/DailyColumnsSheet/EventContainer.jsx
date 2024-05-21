
import { useEffect, useState } from 'react';

import { getClassName } from '../../../utils/dom';

import { getPercentInDateRange } from '../../../utils/date';

import BaseEventContent from './EventContent';

import withEditEvent from '../withEditEvent';
import withDraggableEvent from '../withDraggableEvent';

function EventContainer ( { value, constraint, droppableId, schedulerOptions, offset } ) {
    
    const getStyles = () => {
                
        const topPercent    = getPercentInDateRange(value.start, constraint);
        const bottomPercent = 1 - getPercentInDateRange(value.end, constraint);
        
        return {
            top:    (topPercent * 100) + '%',
            bottom: (bottomPercent * 100) + '%',
            width:  (100 / offset.length) + '%',
            left:   ((100 /offset.length) * offset.current) + '%',
            color: value.color,
            backgroundColor: value.bgColor,
            position: 'absolute'
        }
        
    }
    
    let EventContent = BaseEventContent;
    
    if (schedulerOptions.editable) {
        EventContent = withEditEvent(EventContent, value);
    }
    
    if (schedulerOptions.draggable) {
        EventContent = withDraggableEvent(EventContent, value, droppableId);
    }
    
    return (
        <div 
            className = { getClassName('Scheduler-DailyColumnsSheet-EventContainer') }
            style     = { getStyles() }
            data-draggable = "move-event"
        >
            <EventContent 
                value = { value } 
                schedulerOptions = { schedulerOptions } 
            />
        </div>
    )
    
}

export default EventContainer