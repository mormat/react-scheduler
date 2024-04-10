
import TimelineRow from '../TimelineSheet/Row';

import { useLayoutSize } from '../../../utils/dom';

function TableHeader( { events, days, dateRange, schedulerOptions }) {
    
    const size = useLayoutSize(schedulerOptions);
    
    const formatDate = (d) => {
        const strdate = options => d.toLocaleString(
            schedulerOptions.locale, 
            options
        );
        
        if (schedulerOptions.width < 1024 && days.length === 7) {
             return (<>
                { strdate({ weekday: 'short' }) }
                <br/>
                { strdate({ month: 'short', day: 'numeric' }) }
            </>)
        }
        
        return strdate({ weekday: 'short', month: 'long',  day:'numeric' });
    };
    
    const yAxisWidth = size.width > 640 ? 70 : 30;
    
    return (
        <table style = { { width: '100%'} }>
            { days.length > 1 && (
                <thead>
                    <tr>
                        <th style= {{ width: yAxisWidth }}></th>
                         { days.map( ({ start }) => (
                            <th key={ start }
                                style= {{ textAlign: 'center' }}
                            >
                                { formatDate(start) }
                            </th>
                        )) }
                    </tr>
                </thead>
            ) }
            <tbody>
                <tr>
                    <td style= {{ width: yAxisWidth }}></td>
                    <td colSpan={ days.length }>
                        <TimelineRow
                            events    = { events }
                            dateRange = { dateRange }
                            schedulerOptions = { schedulerOptions }
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    )
    
}

export default TableHeader
    