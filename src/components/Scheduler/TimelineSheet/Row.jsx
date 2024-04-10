
import EventContainer from './EventContainer';

import { formatters }        from '../../../utils/date';
import { calcEventsOffsets } from '../../../models/events';

function Row( { events, dateRange, draggableAreaId, draggableType, schedulerOptions }) {

    const styles = {
        'height': schedulerOptions.spannedEventHeight * events.length,
        'width': '100%',
        'position': 'relative',
    }
    
    const eventsOffsets = calcEventsOffsets(events);
    
    return (
        <div className = "mormat-scheduler-Scheduler-TimelineSheet-Row" 
             style     = { styles }
             data-start = { formatters['yyyy-mm-dd hh:ii'](dateRange.start) }
             data-end   = { formatters['yyyy-mm-dd hh:ii'](dateRange.end) }
        >
            { events.map((event, index) => (
                <EventContainer 
                    key           = { index }
                    event         = { event }
                    index         = { eventsOffsets.get(event).current }
                    dateRange     = { dateRange }
                    draggableAreaId  = { draggableAreaId }
                    draggableType    = { draggableType}
                    schedulerOptions = { schedulerOptions }
                    
                />                    
            )) }
        </div>
    )

}

export default Row