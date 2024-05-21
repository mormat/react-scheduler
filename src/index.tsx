
import BaseScheduler from './components/Scheduler' ;

import { defaultSchedulerConfig } from './components/Scheduler';

import { ISchedulerConfig } from './types';

import withSchedulerEvents from './components/DataHandler/withSchedulerEvents';

import EventsList from './components/EventsManager/EventsList';

import './index.scss';

import { parseString } from './utils/csv';

const _noop = () => {}

const Scheduler = ( props: ISchedulerConfig ) => {

    const schedulerConfig = {
        ...defaultSchedulerConfig,
        initialDate: Date.now(),
        ...props
    }

    // Cast numeric values
    for (const k of ['minHour', 'maxHour']) {
        schedulerConfig[k] = Number(schedulerConfig[k]);
    }

    for (const key of ['width', 'height']) {
        if (!isNaN(Number(schedulerConfig[key]))) {
            schedulerConfig[key] += 'px';
        }
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

    return (
        <Scheduler { ...{ events, schedulerOptions }} />
    )
    
}

export default Scheduler;
export { Scheduler, EventsList }
