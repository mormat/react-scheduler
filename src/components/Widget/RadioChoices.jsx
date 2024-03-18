import { Fragment } from 'react';

function RadioChoices( { name, value, onChange, choices = {} }) {
    
    return (
        <div>
            { Object.entries(choices).map(([v, label]) => (
                <Fragment key   = { v }>
                    <input  type       = "radio"
                            value      = { v }
                            checked    = { value === v }
                            onChange   = { () => onChange(v) }
                            name       = { name }
                            data-label = { label }
                    />
                    <label>{ label } </label>
                </Fragment>
            ))} 
        </div>
    )
    
}

export default RadioChoices;