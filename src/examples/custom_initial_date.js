import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

createRoot( document.getElementById('scheduler' ) ).render(
    <SchedulerWithEventForm 
        initialDate = "2020-01-01"
    />
);
