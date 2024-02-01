
import Event from './Event';

import { formatters } from '../../../utils/date';

function Row( { events, dateRange, draggableAreaId, schedulerOptions }) {

    const styles = {
        'height': schedulerOptions.spannedEventHeight * events.length,
        'width': '100%',
        'position': 'relative',
    }
    
    return (
        <div className = "mormat-scheduler-Scheduler-TimelineSheet-Row" 
             style     = { styles }
             data-start = { formatters['yyyy-mm-dd hh:ii'](dateRange.start) }
             data-end   = { formatters['yyyy-mm-dd hh:ii'](dateRange.end) }
        >
            { events.map((event, index) => (
                <Event 
                    key           = { index }
                    event         = { event }
                    dateRange     = { dateRange }
                    draggableAreaId = { draggableAreaId }
                    schedulerOptions = { schedulerOptions }
                />                    
            )) }
        </div>
    )

}

export default Row