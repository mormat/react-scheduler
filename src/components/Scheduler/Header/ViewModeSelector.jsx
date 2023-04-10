
import { useState, useEffect } from 'react';

function ViewModeSelector( { viewMode = 'week', onViewModeChange = () => {} } ) {
    
    const options = [
        { value: 'day'  },
        { value: 'week' },
        { value: 'month' },
    ];
    
    const [currentValue, setCurrentValue] = useState(viewMode);
    
    const handleChange = (e) => setCurrentValue(e.target.value);
    
    useEffect(() => onViewModeChange(currentValue), [currentValue]);
    
    return (
        <div className="mormat-scheduler-Scheduler-Header-ViewModeSelector">
            { options.map( ({ value, label }) => (
                <label key={ value }>
                    <input  type = "radio" 
                            name = { name } 
                            value    = { value }
                            checked  = { currentValue === value}
                            onChange = { handleChange }
                    />
                    <span>{ value }</span>                        
                </label>
            )) }  
        </div>
    )
}

export default ViewModeSelector