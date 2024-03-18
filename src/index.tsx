
import BaseScheduler from './components/Scheduler' ;

import { defaultSchedulerConfig } from './components/Scheduler';

import { ISchedulerConfig } from './types';

import withRootElement from './components/withRootElement';

import withSchedulerEvents from './components/DataHandler/withSchedulerEvents';

import EventsList from './components/EventsManager/EventsList';

import './index.scss';

import { parseString } from './utils/csv';

const _noop = () => {}

const Scheduler = ( props: ISchedulerConfig ) => {

    const schedulerConfig = {
        events: [],
        initialDate: Date.now(),
        viewMode: 'week',
        defaultEventBgColor: '#0288d1',
        defaultEventColor: 'white',
        locale: 'en',
        width:  800,
        height: 600,
        spannedEventHeight: 20,
        minHour: 6,
        maxHour: 22,
        draggable: true,
        editable: true,
        onEventCreate: () => {},
        onEventUpdate: () => {},
        onEventDelete: () => {},
        ...props
    }

    // Cast numeric values
    for (const k of ['minHour', 'maxHour']) {
        schedulerConfig[k] = Number(schedulerConfig[k]);
    }

    if (!schedulerConfig.initialDate) {
        schedulerConfig.initialDate = Date.now()
    }   

    let { events, ...schedulerOptions } = schedulerConfig;

    if (typeof events === 'string' || events instanceof String) {
        events = parseString(events).filter(e => !e.errors);
    }

    let Scheduler = BaseScheduler;

    if (Array.isArray(events)) {
        Scheduler = withSchedulerEvents(Scheduler);
    }

    Scheduler = withRootElement(Scheduler);

    return (
        <Scheduler { ...{ events, schedulerOptions }} />
    )
    
}

const Truc = Scheduler

export default Scheduler;
export { Scheduler, EventsList, Truc }
