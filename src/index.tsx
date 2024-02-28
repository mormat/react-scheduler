
import BaseScheduler from './components/Scheduler' ;

import { ISchedulerConfig } from './types';

import withRootElement from './components/withRootElement';

import withEventsStaticLoading from './components/DataHandler/withEventsStaticLoading';

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
        onEventCreate: _noop,
        onEventUpdate: _noop,
        onEventDelete: _noop,
        ...props
    }

    let { events, ...schedulerOptions } = schedulerConfig;

    if (typeof events === 'string' || events instanceof String) {
        events = parseString(events).filter(e => !e.errors);
    }

    let Scheduler = BaseScheduler;

    if (Array.isArray(events)) {
        Scheduler = withEventsStaticLoading(Scheduler);
    }

    Scheduler = withRootElement(Scheduler);

    return (
        <Scheduler { ...{ events, schedulerOptions }} />
    )
    
}

export default Scheduler;
export { Scheduler, EventsList }
