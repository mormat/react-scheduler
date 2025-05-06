import { createRoot } from 'react-dom/client';
import { SchedulerWithEventForm } from '@mormat/react_scheduler';

createRoot( document.getElementById('scheduler' ) ).render(
    <SchedulerWithEventForm 
        viewMode = "month"
    />
);
