

import { formatters } from '../../../utils/date';

function EventContent( { value, schedulerOptions } )
{
    return (
        <div className="mormat-scheduler-Scheduler-DailyColumnsSheet-EventContent">
            <div data-role="header">  
                <span data-type="hour">
                    { formatters['hh:ii'](value.start) }
                </span>

                &nbsp;-&nbsp;
                <span data-type="hour">
                    { formatters['hh:ii'](value.end) }
                </span>

            </div>
            <div data-role = "content">
                { value.label }
            </div>
            <div data-draggable="resize-event" />
        </div>
    )
}

export default EventContent