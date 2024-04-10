
import { useEffect, useState, useRef } from 'react';


function withExtensibleHeader( WrappedComponent, header ) {
    
    return function( { schedulerOptions, ...otherProps} ) {
   
        return (
                
            <div 
                className = "mormat-scheduler-Widget-withExtensibleHeader"
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
                
                <div 
                    style = {{ 
                        /* border: "2px dotted blue", */
                        flex: '1 1 auto',
                        position: "relative"
                    }} 
                >
                
                    <WrappedComponent 
                        schedulerOptions = { schedulerOptions }
                        { ...otherProps } 
                    />

                </div>
            
            </div>
            
        )
        
    }
    
}

export default withExtensibleHeader
    