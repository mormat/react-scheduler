
import { date_add } from '../../../utils/date';

function GridHeader( { dateRange, schedulerOptions } ) {
    
    const days = Array.apply(null, {length: 7}).map((_, k) => {
        
        const date = date_add(dateRange.start, k, 'day');
        
        return date.toLocaleString(
            schedulerOptions.locale,
            {
                weekday: schedulerOptions.width > 960 ? 'long' : 'short'
            }
        )

    });
    
    return (
            
        <table style = {{ width: '100%'}} >
            <thead>
                <tr style = {{ width: "33%" }} >
                    { days.map((day, k) => (
                        <th key = { k }> 
                            { day } 
                        </th>
                    )) }
                </tr>
            </thead>
        </table>
            
    )
    
}

export default GridHeader