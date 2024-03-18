
import { useUniqueId } from '../../../utils/dom';

const colors = ['#0288d1', '#9575cd', '#0fc4a7', '#721c24', '#856404', '#383d41'];

function ColorPicker({value, onChange, label, decorators = {} }) {
    
    const decorates = (type, subject) => {
        return decorators[type] ? decorators[type](subject) : subject;
    }
    
    return (
        <span className="mormat-scheduler-Widget-Form-ColorPicker" 
              data-label     = { label }
              data-form-type = "ColorPicker"
        >
        
            { decorates('label', (
                <label>{ label }</label>
            )) }
        
            <span>
            { colors.map((v) => (
                <label  key = { v } 
                        onMouseDown = { e => e.preventDefault() }
                        style = { { 
                            borderColor: v === value ? v : 'transparent'
                        } }
                        data-label = { v }
                >
                    <span style = { { backgroundColor: v } }>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <input  
                        type       = "radio" 
                        value      = { v } 
                        checked    = { value === v }
                        onChange   = { e => onChange(e.target.value) }
                        
                    />
                    <span style = {{ display: 'none'}}>
                        { v }
                    </span>
                </label>
                
            )) }
            </span>
        </span>
    )
    
}

export default ColorPicker