
import { useUniqueId } from '../../utils/dom';

function ColorSelect({value, setValue, colors, ...otherProps}) {

    const name = useUniqueId();
    
    return (
        <span className="mormat-scheduler-Widget-ColorSelect" 
            { ...otherProps } 
        >
            { colors.map((v) => (
                <label key = { v }>
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
                    
                    &nbsp;
                </label>
                
            )) }
        </span>
    )
    
}

export default ColorSelect