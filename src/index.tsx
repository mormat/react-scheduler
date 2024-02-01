import React         from 'react'
import ReactDOM      from 'react-dom'

import BaseScheduler from './components/Scheduler' ;

import { SchedulerConfig } from './types';

import withRootElement from './components/withRootElement';

import withEventsStaticLoading from './components/DataHandler/withEventsStaticLoading';

import EventsList from './components/EventsManager/EventsList';

import './index.scss';

const _noop = () => {}

const Scheduler = ( { events = [], ...other}: SchedulerConfig ) => {

    const schedulerOptions = {
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
        draggable: false,
        onEventCreate: _noop,
        onEventUpdate: _noop,
        onEventDelete: _noop,
        ...other
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
