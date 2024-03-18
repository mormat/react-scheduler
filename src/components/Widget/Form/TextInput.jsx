
function TextInput({ name, label, value, onChange, ...otherProps }) {
    
    return (
        <div className = "mormat-scheduler-Widget-Form" 
             data-label= { label }
        >
            <input type  = "text" 
                value    = { value }
                name     = { name }
                onChange = { e => onChange(e.target.value) }
                { ...otherProps }
            />
        </div>
    )
    
}

export default TextInput;