
import { Fragment }      from 'react';

import Button            from '../Widget/Button'
import ToggleButtonGroup from '../Widget/ToggleButtonGroup';

import { date_add } from '../../utils/date';

function withLayout( WrappedComponent, { currentDate, setCurrentDate, viewMode, setViewMode, title = '' } ) {
        
    function Title() {
        return (
            <h3>
                { title || (<span>&nbsp;</span>) }
            </h3>
        )
    }
        
    function Navigation( { labels }) {
        return (
            <div style = {{ float: 'left'}}>
                <Button onClick = { () => setCurrentDate( date_add(currentDate, -1, viewMode) ) } 
                        variant = "outline"
                >
                    &lt;
                </Button>
                <Button onClick = { () => setCurrentDate(new Date()) } 
                        variant    = "outline"
                >
                    { labels['header.today'] || 'today' }
                </Button>
                <Button onClick =  { () => setCurrentDate( date_add(currentDate, 1, viewMode) ) } 
                        variant    = "outline"
                >
                    &gt;
                </Button>            
            </div>
        )
    }
    
    function Tabs( { labels } ) {
        return (
            <div style = {{ float: 'right'}}>
                <ToggleButtonGroup 
                    value    = { viewMode } 
                    onChange = { setViewMode } 
                    options = {[
                        { value: 'day',   label: labels['header.day']   || 'day'   },
                        { value: 'week',  label: labels['header.week']  || 'week'  },
                        { value: 'month', label: labels['header.month'] || 'month' },
                    ]}
                />
            </div>
        )
    }
    
    return function( { schedulerOptions, ...otherProps} ) {
    
        const navigation = ( <Navigation { ...schedulerOptions } /> );
        const tabs       = ( <Tabs { ...schedulerOptions } /> )
    
        const headers = schedulerOptions.width > 640 ?
            [[navigation, tabs, <Title />]] :
            [[navigation, tabs], [<Title />]]
        ;
        
        const headerHeight = 40;
        const remainingHeight = schedulerOptions.height - (headers.length * headerHeight);
        
        return (
            <div className="mormat-scheduler-Scheduler-withLayout" 
                style = { { 
                    position: 'relative',
                    height: schedulerOptions.height,
                    width:  schedulerOptions.width
                } }
            >

                <div>
                { headers.map((header, k1) => (
                    <div key   = { k1 }
                         style = {{ 
                            height: headerHeight + 'px'
                        }}
                    >
                        { header.map((v, k2) => <Fragment key={k2}>{v}</Fragment> ) }
                    </div>    
                )) }
                </div>

                <div
                    style = {{
                        height: remainingHeight + 'px'
                    }}
                >
                
                    <WrappedComponent 
                        schedulerOptions = { { ...schedulerOptions, height: remainingHeight } }
                        { ...otherProps } 
                    />
                    
                </div>

            </div>
        )

    }
}

export default withLayout