
import BaseScheduler from './components/Scheduler';
import withRootElement from './components/withRootElement';
import { 
    withEventForm,
    DefaultEventForm,
    OkCancelDialog 
} from './components/EventForm';

import './react_scheduler.scss';
import '@mormat/jscheduler_ui/dist/jscheduler_ui.css';

const Scheduler = withRootElement( BaseScheduler );

export default Scheduler;
    
export { 
    Scheduler, 
    withEventForm,
    DefaultEventForm, 
    OkCancelDialog 
}
