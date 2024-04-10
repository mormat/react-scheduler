
import Header   from './Header';
import BaseGrid from './Grid';

import withExtensibleHeader from '../../Widget/withExtensibleHeader';

function BaseSheet( { schedulerOptions, ...otherProps } ) {
    
    const header = (
        <Header 
            schedulerOptions = { schedulerOptions } 
            { ...otherProps }
        />
    )
    
    let Grid = BaseGrid;
    Grid = withExtensibleHeader(Grid, header);
    
    return (

        <Grid 
            schedulerOptions = { schedulerOptions }
            { ...otherProps }
        />

    )
    
}

export default BaseSheet

    