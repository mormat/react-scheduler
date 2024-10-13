
const Layout = {
    
    Default: ( { header, body } ) => {
        return (
            <>
                { header }
                { body }
            </>
        )
    },
    
    FixedHeader: ( { header, body } ) => (
        <div style={{ display: 'flex', 
                      flexFlow: 'column', 
                    ...Layout.styles['full']
        }}>
            <div style= {{ flex: '0 1 auto', width: '100%'  }}>
                { header }
            </div>
            <div style={{ flex: '1 1 auto', position: 'relative' }}>
                { body }
            </div>
        </div>        
    ),
    
    styles: {
        full: {
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0 
        }
    }
}

function withOverlay(WrappedComponent) {
    
    return function(props) {
    
        return (
            <div style = {{
                position: 'fixed',
                top: 0, left: 0, bottom: 0, right: 0,
                zIndex: 999997,
            }} >
                <div style = {{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0, right: 0,
                    backgroundColor: 'white',
                    opacity: 0.7,
                    zIndex: 999998
                }}></div>
                <div style = {{
                    position: 'relative',
                    top: 0, height: '100%',
                    marginLeft:   'auto',
                    marginRight: 'auto',
                    display: 'table',
                    zIndex: 999999
                }} >
                    <div style= {{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                    }} >
                        <WrappedComponent { ...props } />
                    </div>
                </div>
            </div>
        )
        
    }
    
} 

export default Layout

export { Layout, withOverlay }