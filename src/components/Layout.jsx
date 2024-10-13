
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


export default Layout
