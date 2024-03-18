import { Fragment } from 'react';

import { useUniqueId } from '../../../utils/dom';

function RadioChoices( { name, value, onChange, required, choices = {} }) {
    
    const uniqueId = useUniqueId() + '_';
    
    return (
        <div>
            { Object.entries(choices).map(([v, label], k) => (
                <Fragment key   = { v }>
                    <input  type       = "radio"
                            value      = { v }
                            checked    = { value === v }
                            onChange   = { () => onChange(v) }
                            id         = { uniqueId + k }
                            name       = { name }
                            data-label = { label }
                            required   = { required }
                    />
                    <label htmlFor = { uniqueId + k }>
                        { label }
                    </label>
                    &nbsp;
                </Fragment>
            ))} 
        </div>
    )
    
}

export default RadioChoices;