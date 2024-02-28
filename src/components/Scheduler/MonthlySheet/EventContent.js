
function EventContent( { value, schedulerOptions } )
{
    
    return (
        <div className="mormat-scheduler-Scheduler-MonthlySheet-EventContent">
            <span data-role="header">
                { value.label }
            </span>
        </div>        
    )
    
}

export default EventContent;