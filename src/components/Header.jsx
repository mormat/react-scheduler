
import Button            from './Widget/Button'
import ToggleButtonGroup from './Widget/ToggleButtonGroup';

import { useState, useEffect } from 'react'

import { date_add } from '../utils/date';

function Title( { title } ) {
    
    return (
        <h3>
            { title || (<span>&nbsp;</span>) }
        </h3>
    )
}

function Navigation( { schedulerOptions, currentDate, setCurrentDate, viewMode }) {
 
    const { labels } = schedulerOptions;
 
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

function Tabs( { schedulerOptions, viewMode, setViewMode } ) {
    
    const { labels } = schedulerOptions;
    
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

const Header = function( props ) {
    
    return (
        <div 
            className  = "mormat-scheduler-Header"
        >

            <div>
                <Navigation { ... props } />
                
                <Tabs { ... props } />
            </div>
            
            <div>
            
                <Title { ... props } />
            
            </div>
        
        </div>    
    );
        
}

export default Header;