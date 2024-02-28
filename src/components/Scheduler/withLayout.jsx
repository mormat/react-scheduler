
import Button from '../Widget/Button'
import ToggleButtonGroup from '../Widget/ToggleButtonGroup';

import { date_add } from '../../utils/date';

function withLayout( WrappedComponent, { currentDate, setCurrentDate, viewMode, setViewMode, title = '' } ) {
        
    return function( { schedulerOptions, ...otherProps} ) {
        
        return (
            <div className="mormat-scheduler-Scheduler-withLayout" 
                style = { { 
                    position: 'relative',
                    height: schedulerOptions.height,
                    width: schedulerOptions.width, 
                    
                } }
            >

                <div data-role="header">
                
                    <h3>{ title || (<span>&nbsp;</span>) }</h3>

                    <div>
                        <Button onClick = { () => setCurrentDate( date_add(currentDate, -1, viewMode) ) } 
                                variant = "outline"
                        >
                            &lt;
                        </Button>
                        <Button onClick = { () => setCurrentDate(new Date()) } 
                                variant    = "outline"
                        >
                            today
                        </Button>
                        <Button onClick =  { () => setCurrentDate( date_add(currentDate, 1, viewMode) ) } 
                                variant    = "outline"
                        >
                            &gt;
                        </Button>            
                    </div>

                    <div>
                        <ToggleButtonGroup 
                            value    = { viewMode } 
                            onChange = { setViewMode } 
                            options = {[
                                { value: 'day',   label: 'day'  },
                                { value: 'week',  label: 'week' },
                                { value: 'month', label: 'month' },
                            ]}
                        />
                    </div>

                </div>

                <div >
                    <WrappedComponent 
                        schedulerOptions = { schedulerOptions }
                        { ...otherProps } 
                    />
                </div>

            </div>
        )

    }
}

export default withLayout