import { createRoot } from 'react-dom/client';
import Scheduler from '@mormat/react_scheduler';

const root = createRoot( document.getElementById('scheduler' ) );
root.render(<Scheduler />);
