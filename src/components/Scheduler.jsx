
import { useEffect, useRef, useState } from 'react';
import jscheduler_ui from '@mormat/jscheduler_ui';

import Header from './Header';
import Layout from './Layout';

const instances = new Map();

function Scheduler( { translations = {}, ...schedulerProps } ) {
        
    const divRef = useRef();
    const [viewMode,       setViewMode]       = useState('week');
    const [currentDate,    setCurrentDate]    = useState();
    const [schedulerLabel, setSchedulerLabel] = useState('');
    
    const getInstance = () => instances.get(divRef.current);
    
    useEffect(() => {
        
        const { events, ...otherSchedulerProps } = schedulerProps;
        
        const element  = divRef.current;     
        const scheduler = jscheduler_ui.render(
            element, 
            { 
                ...defaultSchedulerProps, 
                ...otherSchedulerProps,
                styles: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
            }
        );
        setSchedulerLabel( scheduler.getLabel() );
        instances.set(element, scheduler );
        
        if (Array.isArray(events)) {
            scheduler.setOptions({ events });
        }
        loadEvents(events);
        
        return function() {
            instances.delete( element );
        }
        
    }, []);
    
    useEffect(() => {
        const scheduler = instances.get(divRef.current);
        scheduler.setOptions( { 
            viewMode, 
            headersVisible: viewMode !== 'day'
        } );
        setSchedulerLabel( scheduler.getLabel() );
        loadEvents( schedulerProps.events );
        
    }, [viewMode, currentDate]);
    
    const handleClickNext = (e) => {
        e.preventDefault();
        const scheduler = getInstance();
        scheduler.next();
        setCurrentDate( scheduler.getOption('currentDate') );
    }
    
    const handleClickToday = (e) => {
        e.preventDefault();
        const scheduler = getInstance();
        scheduler.today();
        setCurrentDate( scheduler.getOption('currentDate') );
    }
    
    const handleClickPrevious = (e) => {
        e.preventDefault();
        const scheduler = getInstance();
        scheduler.previous();
        setCurrentDate( scheduler.getOption('currentDate') );
    }
    
    function loadEvents(events) {
        const scheduler = instances.get(divRef.current);
        
        if (typeof events === 'function') {
            const dateRange = scheduler.getEventsDateRange();
            const setEvents = (events) => {
                scheduler.setOptions({ events });
            };
            events({ dateRange, setEvents });
            
        }
        
    }
    
    const header = (
        <Header>
            <Header.ButtonGroup 
                items={[
                    { label: '<',     onClick: handleClickPrevious },
                    { 
                        label: translations['header.today'] || 'today', 
                        onClick: handleClickToday 
                    },
                    { label: '>',     onClick: handleClickNext },
                ]} 
            />
            <h4>{ schedulerLabel }</h4>
            <Header.ToggleGroup 
                items={[
                    { 
                        label: translations['header.day'] || 'day', 
                        value: 'day' 
                    },
                    { 
                        label: translations['header.week'] || 'week', 
                        value: 'week' 
                    },
                    { 
                        label: translations['header.month'] || 'month', 
                        value: 'month'
                    }
                ]} 
                onChange = { (e) => setViewMode(e.target.value)} 
                value={ viewMode } 
            />
        </Header>
    );
    
    return ( 
        <Layout.FixedHeader 
            header = { header }
            body   = {( 
                <div ref = { divRef } 
                     data-scheduler
                     style= { Layout.styles['full'] }>
                </div>
            )}
        /> 
    )
    
}

const defaultSchedulerProps = {
    headerRenderer: function( { year, monthIndex, day } ) {
        var date = new Date(year, monthIndex, day);
        return date.toLocaleString(
            'en', 
            { 
                weekday: 'short', 
                month: 'short',  
                day:'numeric',
            }
        ) 
    }
}


export default Scheduler;
    
export { instances }
