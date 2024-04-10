
import withExtensibleHeader from '../Widget/withExtensibleHeader';

import BaseSheet from './TimelineSheet/BaseSheet';

import { getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/date';
import { getFirstDayOfWeek,  getLastDayOfWeek }  from '../../utils/date';

function withLayout( WrappedComponent, { header = '', subheader = '' }) {
    
    return function( { schedulerOptions, ...otherProps} ) {
        
        const headers = (
            <>
                { header }
                { subheader }
            </>
        )
        
        let Component = WrappedComponent;
        // Component = withParentSizeAware(Component);
        Component = withExtensibleHeader(Component, headers);
        
        return (
            <Component 
                schedulerOptions = { schedulerOptions }
                { ...otherProps }
            />
        )
    }
    
}

function TimelineSheet( { schedulerOptions, currentDate, layoutProps,...otherProps } ) {
    
    const dateRange = {
        start: new Date(getFirstDayOfWeek(getFirstDayOfMonth(currentDate)) + ' 00:00'),
        end:   new Date(getLastDayOfWeek( getLastDayOfMonth(currentDate))  + ' 23:59'),
    };
    
    const title = "foobar";
    
    let Component = BaseSheet;
    Component = withLayout(BaseSheet, {...layoutProps, title })
    
    return (
            
        <div class="mormat-scheduler-Scheduler-TimelineSheet">

            <Component 
                schedulerOptions = { schedulerOptions }
                dateRange = { dateRange }
                { ... otherProps } 
            /> 

        </div>
        
    )
    
}

export default TimelineSheet
export { withLayout }