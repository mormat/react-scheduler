
import DailyTimelineEvent from './DailyTimelineEvent';

import Constants from '../../constants';

function DailyTimeline( { events, dateRange }) {

    const styles = {
        'height': Constants.SPANNED_EVENT_HEIGHT * events.length
    }

    return (
        <div className = "mormat-scheduler-Scheduler-DailyTimeline" 
             style     = { styles }
        >
            { events.map((event, index) => (
        
                <DailyTimelineEvent 
                    key       = { index }
                    event     = { event }
                    dateRange = { dateRange }
                />                    
            )) }
        </div>
    )

}

export default DailyTimeline