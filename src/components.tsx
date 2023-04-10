
import BaseScheduler from './components/Scheduler' ;

import BaseEventsManager from './components/EventsManager';

import { SchedulerConfig } from './types';

import { cleanEvent } from './models/events';

import './styles.js';

const Scheduler = ( rawConfig: SchedulerConfig ) => {

    const config: SchedulerConfig= {
        minHour: 6,
        maxHour: 22,
        enableOverlapping: false,
        viewMode: 'week',
        events: [],
        initialDate: Date.now(),
        locale: 'en',
        ...rawConfig
    }

    config.events = config.events.map(cleanEvent);

    return BaseScheduler({...config});
    
}

const EventsManager = ( rawConfig: SchedulerConfig ) => {

    const config: SchedulerConfig = { 
        events: [],
        ...rawConfig 
    }

    config.events = config.events.map(cleanEvent);
    
    return (<BaseEventsManager { ...config } />);

}

export default Scheduler;
export { EventsManager }