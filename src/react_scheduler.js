
import BaseScheduler from './components/Scheduler';
import withRootElement from './components/withRootElement';
import EventForm from './components/EventForm';
import { OkCancelDialog } from './components/EventForm';

import './react_scheduler.scss';
import '@mormat/jscheduler_ui/dist/jscheduler_ui.css';

const Scheduler = withRootElement( BaseScheduler );

export default Scheduler;
    
export { Scheduler, EventForm, OkCancelDialog }
