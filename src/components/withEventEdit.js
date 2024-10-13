
function withEventEdit( WrappedComponent ) {
    
    return function( { onEventEdit, ...otherProps } ) {
        
        const onEventClick = (schedulerEvent) => {
            onEventEdit( schedulerEvent );
        }
        
        return (
            <WrappedComponent { ...otherProps } 
                onEventClick = { onEventClick }
                eventClickable = { true }
            />
        );
        
    }
    
}

export default withEventEdit