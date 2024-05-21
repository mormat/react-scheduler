
import { Fragment } from 'react';

import EventContainer from './EventContainer';

import { format_date, DateRange } from '../../../utils/date';


function Row( { events, dateRange, droppableId, draggableType, schedulerOptions }) {

    const groupedEvents = DateRange.groupByPosition(events);
    
    return (
        <div className = "mormat-scheduler-Scheduler-TimelineSheet-Row" 
             style     = { {
                'height': schedulerOptions.spannedEventHeight * groupedEvents.length,
                'width': '100%',
                'position': 'relative',
             } }
             data-start = { format_date('yyyy-mm-dd hh:ii', dateRange.start) }
             data-end   = { format_date('yyyy-mm-dd hh:ii', dateRange.end) }
        >
            { groupedEvents.map((events, offset) => (
                <Fragment key = { offset } >
            
                    { events.map((event, k) => (
                            
                        <EventContainer 
                            key           = { k }
                            event         = { event }
                            index         = { offset }
                            dateRange     = { dateRange }
                            droppableId  = { droppableId }
                            draggableType    = { draggableType}
                            schedulerOptions = { schedulerOptions }

                        />  
                                
                    ) ) }
            
                </Fragment>
            ) ) }
            
                
        </div>
    )

}

export default Row