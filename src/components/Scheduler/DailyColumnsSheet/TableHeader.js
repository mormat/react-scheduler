
import TimelineRow from '../TimelineSheet/Row';

import { format_date } from '../../../utils/date';
import { useUniqueId } from '../../../utils/dom';

function TableHeader( { events, dateRange, schedulerOptions }) {
    
    const days = dateRange.getDays();
    
    const droppableId = useUniqueId();
    
    const yAxisWidth = 30;
    
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
                                { 
                                    start.toLocaleString(
                                        schedulerOptions.locale, 
                                        { 
                                            weekday: 'short', 
                                            month: 'short',  
                                            day:'numeric' 
                                        }
                                    ) 
                                }
                            </th>
                        )) }
                    </tr>
                </thead>
            ) }
            <tbody>
                <tr>
                    <td style= {{ width: yAxisWidth }}></td>
                    <td colSpan={ days.length } 
                        id    = { droppableId }
                        style = {{ position: 'relative' }}
                        data-droppable-type = "timeline"
                    >
                        { days.map(({ start }, index) => (
                            <div key = { index } 
                                 style = { { 
                                     position: 'absolute',
                                     width: (100 / days.length) + '%',
                                     height: '100%',
                                     top: 0,
                                     left: (index * 100 / days.length) + '%',
                                } }
                                data-day = { format_date('yyyy-mm-dd', start) }
                            >
                            </div>
                        )) }

                         <TimelineRow
                            events    = { events }
                            dateRange = { dateRange }
                            schedulerOptions = { schedulerOptions }
                            droppableId  = { droppableId } 
                            draggableType    = "timeline"
                        />

                    </td>
                </tr>
            </tbody>
        </table>
    )
    
}

export default TableHeader
    