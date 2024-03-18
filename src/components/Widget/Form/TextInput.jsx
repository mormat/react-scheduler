
function TextInput({ name, label, value, onChange, decorators = {}, ...otherProps }) {
    
    const decorates = (type, subject) => {
        return decorators[type] ? decorators[type](subject, name) : subject;
    }
    
    return (
        <span className = "mormat-scheduler-Widget-Form" 
             data-label= { label }
        >
            { decorates('label', (
                <label>{ label }</label>
            )) }
        
            <input type  = "text" 
                value    = { value }
                onChange = { e => onChange(e.target.value) }
                { ...otherProps }
            />
        </span>
    )
    
}

export default TextInput;