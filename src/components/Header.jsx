import { useState } from 'react';

import { useUniqueId } from '@src/utils/hooks';

const Header = ({ children }) => (
    <div className="mormat-scheduler-Header" 
         style={{ overflow: 'visible', padding: '1px' }} 
    >
        <div style={{ width: '33.33%', float: 'left', textAlign: 'left' }}>
            { children[0] }
        </div>
        <div style={{ width: '33.33%', float: 'left', textAlign: 'center' }}>
            { children[1] }
        </div>
        <div style={{ width: '33.33%', float: 'right', textAlign: 'right' }}>
            { children[2] }
        </div>
    </div>                
);

Header.ButtonGroup = ({ items }) => (
    <div>
        { items.map( ( { label, onClick }, k)  => (
            <button key={ k } onClick={ onClick } >
                { label }
            </button>
        )) }
    </div>
);

Header.ToggleGroup = ({ items, value, onChange }) => {
    
    const name = useUniqueId();
    const [currentValue, setCurrentValue] = useState( value );
    
    const handleChange = (e) => {
        setCurrentValue(e.target.value);
        onChange(e);
    }
    
    return (
        <div>
            { items.map( ({ value, label }, k) => (
                <label key={ k }>
                    <input type="radio" 
                        checked = { currentValue === value }
                        onChange = { handleChange }
                        { ... { value, name } }  

                    />
                    &nbsp;
                    { label }
                    &nbsp;
                </label>
            ) ) }
        </div>
    )
    
};

export default Header