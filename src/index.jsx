import React         from 'react'
import ReactDOM      from 'react-dom'

import Scheduler     from './components';
import { EventsManager } from './components';
import { buildEventsManager } from './models/events';

window.mormat_scheduler = {
    
    bindScheduler: (element, config = {}) => {
        
        ReactDOM.render(
            <React.StrictMode>
                <Scheduler { ...config } />
            </React.StrictMode>,
            element
        );
        
    },
    
    bindEventsManager: (element, config = {}) => {
        
        ReactDOM.render(
            <React.StrictMode>
                <EventsManager { ...config } />
            </React.StrictMode>,
            element
        );
        
    },
    
    buildEventsManager
    
}
