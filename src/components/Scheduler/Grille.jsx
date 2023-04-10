
import { Fragment } from 'react';

function Grille({cols = 0, rows = 0}) {
    
    const commonStyles = {
        position: 'absolute',
        display: 'block'
    }
    
    const verticalLines = Array.from(
        { length: cols - 1 }, 
        (_, i) => ({
            ...commonStyles,
            top: 0,
            left: ((i + 1) * 100 / cols) + '%',
            borderLeft: '1px dashed lightgray',
            height: '100%'
        })
    );
    
    const horizontalLines = Array.from(
        { length: rows - 1 }, 
        (_, i) => ({
            ...commonStyles,
            top: ((i + 1) * 100 / rows) + '%',
            left: 0,
            borderTop: '1px dashed lightgray',
            width: '100%'
        })
    );
    
    return (
        <Fragment>
        
            { verticalLines.map( (style, index) => (
                <span 
                    key   = { index }
                    style = { style }
                    data-orientation = "vertical"
                />
            )) }
    
            { horizontalLines.map( (style, index) => (
                <span 
                    key   = { index }
                    style = { style }
                    data-orientation = "horizontal"
                />
            )) }
        
        </Fragment>
    )

}

export default Grille