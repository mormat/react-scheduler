
import { DateRange } from '../../../utils/date';

function GridHeader( { dateRange, schedulerOptions } ) {
    
    const firstWeek = DateRange.createWeek(dateRange.start);
    
    const labels = firstWeek.getDays().map( ({start}) => start.toLocaleString(
        schedulerOptions.locale,
        {
            weekday: 'short'
        }
    ));
    
    return (
            
        <table style = {{ width: '100%'}} >
            <thead>
                <tr>
                    { labels.map( label => (
                        <th key   = { label }
                            style = {{ width: (100 / 7) + "%" }}
                        > 
                            { label } 
                        </th>
                    )) }
                </tr>
            </thead>
        </table>
            
    )
    
}

export default GridHeader