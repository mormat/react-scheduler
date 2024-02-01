
import { useState, useEffect } from 'react';

function ToggleButtonGroup( { value, onChange = () => {}, options = [] } ) {
    
    return (
        <div className="mormat-scheduler-Widget-ToggleButtonGroup">
            { options.map( (option) => (
                <button key={ option.value }
                    onClick = { e => onChange(option.value) }
                    data-checked = { value === option.value}
                >
                    <span>{ option.label }</span>                        
                </button>
            )) }  
        </div>
    )
}

export default ToggleButtonGroup