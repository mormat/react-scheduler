
import { useEffect, useState } from 'react';

function DateBrowser( { onNextClick, onPreviousClick, onTodayClick } ) {
    
    return (
        <div className="mormat-scheduler-Scheduler-Header-DateBrowser">
            <button onClick= { onPreviousClick } >
                &lt;
            </button>
            <button onClick= { onTodayClick } >
                today
            </button>
            <button onClick= { onNextClick } >
                &gt;
            </button>
        </div>
    )
    
}

export default DateBrowser