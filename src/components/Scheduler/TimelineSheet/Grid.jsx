
import { date_add } from '../../../utils/date';

import { indexBy } from '../../../utils/collections';

function Grid( { dateRange, schedulerOptions, parentSize } ) {

    const dates = [];
    let d = new Date(dateRange.start);
    while (d < dateRange.end) {
        dates.push(d);
        d = date_add(d, 1, 'day')
    }
    
    const rows = Object.values(
        indexBy(dates,  (_, k) => Math.floor(k / 7) )
    );
    
    const rowHeight = parentSize.height / rows.length;
    
    return (
        
        <table style = {{ width: '100%', borderSpacing: 0 }}>
            <tbody>
                
                { rows.map( (dates, k) => (
                    <tr key = { k }
                        style = {{ height: rowHeight }}
                    >
                        { dates.map( (date, k2) => (
                            <td key = { k2 }
                                style = {{ width: (100 / 7) + '%' }}
                            >
                                foo
                            </td>
                        )) }
                    </tr>
                )) }
            
            </tbody>
        </table>
            
    )
    
}

export default Grid

    