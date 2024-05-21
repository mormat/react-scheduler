
function withFixedHeader( WrappedComponent, header ) {
    
    return ( props ) => {
        
        return (
            
            <div className="mormat-scheduler-Scheduler-withFixedHeader"
                 style = {{ 
                    display:  'flex',
                    flexFlow: 'column',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                 }}
            >

                <div style = {{ flex: '0 1 auto'  }} >
                    { header }
                </div>

                <div style = {{ flex: '1 1 auto', position: "relative" }} >
                    <WrappedComponent  { ...props }  />
                </div>

            </div>
        
        )

    }
    
}

export default withFixedHeader
    