function Button({children, variant = "outline", ...otherProps}) {
    
    return (
        <button  className="mormat-scheduler-Widget-Button" 
            data-variant = { variant }
            { ...otherProps } 
        >
            { children }
        </button>        
    )
    
}

export default Button