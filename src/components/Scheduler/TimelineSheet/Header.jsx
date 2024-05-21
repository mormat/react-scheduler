
import { date_add } from '../../../utils/date';

function Header( { schedulerOptions, parentSize } ) {
    
    const days = Array.from({length: 7}).map((_, k) => {
        
        const date = date_add("1970-01-01", k + 4, 'day')
        
        return date.toLocaleString(
            schedulerOptions.locale,
            {
                weekday: 'short'
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

export default Header

    