
import { getDaysBetween } from '../../utils/date';

import constants from '../../constants';

function DailyTimelineEvent( { event, dateRange }) {

    const nbrDays = getDaysBetween(dateRange).length;
    
    const offset  = Math.max(
        getDaysBetween({
            start: dateRange.start, 
            end: event.start}
        ).length - 1,
        0
    );
    
    const length  = Math.min(
        getDaysBetween({
            start: Math.max(event.start, dateRange.start),
            end:  event.end
        }).length,
        nbrDays - offset
    );
    
    const unit = 100 / nbrDays;
    
    const styles = {
        'width': length * unit + '%',
        'left':  offset * unit + '%',
        'display': 'block',
        'position': 'absolute',
        'height': constants.SPANNED_EVENT_HEIGHT,
        'color':  event.color || constants.EVENT_DEFAULT_COLOR,
        backgroundColor: event.bgColor || constants.EVENT_DEFAULT_BG_COLOR
    }
        
    return (
        <span 
            className = "mormat-scheduler-event"
            style = { styles } 
        >
            { event.label }
        </span>
    )

}

export default DailyTimelineEvent