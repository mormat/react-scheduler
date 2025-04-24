import { createRoot } from 'react-dom/client';
import { 
    Scheduler, 
    DefaultEventForm, 
    withEventForm 
} from '@mormat/react_scheduler';

const SchedulerWithEventForm = withEventForm(Scheduler, DefaultEventForm);

const handleEventCreate = function(values) {
    document.getElementById('comments').innerHTML = `'${values.label}' event created`;
}

const root = createRoot( document.getElementById('scheduler' ) );
root.render( 
    <SchedulerWithEventForm 
        onEventCreate = { handleEventCreate }
    /> 
);