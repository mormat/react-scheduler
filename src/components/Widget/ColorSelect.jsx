
import { useUniqueId } from '../../utils/dom';

function ColorSelect({value, setValue, colors, ...otherProps}) {

    const name = useUniqueId();
    
    return (
        <span className="mormat-scheduler-Widget-ColorSelect" 
            { ...otherProps } 
        >
            { colors.map((v) => (
                <label  key = { v } 
                        onMouseDown = { e => e.preventDefault() }
                        style = { { 
                            borderColor: v === value ? v : 'transparent'
                        } }
                >
                    <span style = { { backgroundColor: v } }>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <input  
                        type = "radio" 
                        value = { v } 
                        name = { name } 
                        checked = { value === v }
                        onChange = { e => setValue(e.target.value) }
                    />
                    <span style = {{ display: 'none'}}>
                        { v }
                    </span>
                </label>
                
                )) }
        </span>
    )
    
}

export default ColorSelect