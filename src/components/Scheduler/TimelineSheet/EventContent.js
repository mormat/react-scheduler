
function EventContent( { event, schedulerOptions } )
{
    return (
        <div className = "mormat-scheduler-TimelineSheet-EventContent">
            <span data-role="header">
                { event.label }
            </span>
        </div>
    )
}

export default EventContent