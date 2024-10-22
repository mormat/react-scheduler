import { createRoot } from 'react-dom/client';
import { Scheduler } from '@mormat/react_scheduler';
import { utils }     from '@mormat/jscheduler_ui';

import { useState, useMemo } from 'react';

import BootstrapEventForm from './components/EventForm/BootstrapEventForm'

const webpack_mode = __WEBPACK_MODE__;
const url = new URL(window.location.href);

function App() {
    
    const [schedulerEvent, setSchedulerEvent] = useState();
    
    const scheduler = useMemo(() => {
        
        const startDay = (new utils.Day(Date.now())).getFirstDayOfWeek();
    
        const events = [
            { 
                start: startDay.addDays(1) + " 10:00", 
                label: "interview",
                bgColor: '#0288d1',
            },
            { 
                start: startDay.addDays(3) + " 09:00", 
                end:   startDay.addDays(3) + " 18:00", 
                label: "meeting",
                bgColor: '#9575cd',
            },
            { 
                label: "training course",
                start: startDay.addDays(2) + " 09:00",
                end  : startDay.addDays(5) + " 18:00",
                bgColor: "#0fc4a7" 
            }
          ];

        const handleEventAdd = (schedulerEvent) => {
            setSchedulerEvent(schedulerEvent);
        };

        const handleEventEdit = (schedulerEvent) => {
            setSchedulerEvent(schedulerEvent);
        };
        
        return (
            <Scheduler 
                events = { events } 
                onEventDrop   = { () => {} }
                onEventResize = { () => {} }
                onEventAdd  = { handleEventAdd }
                onEventEdit = { handleEventEdit }
                
            />        
        )
        
    }, [setSchedulerEvent]);
    
    return (
        <>
            { scheduler }
            { schedulerEvent && (
                <BootstrapEventForm 
                    values = { schedulerEvent.values }
                    onConfirm = { ( values ) => {
                        schedulerEvent.update( values );
                        setSchedulerEvent(null);
                    } }
                    onCancel = { () => setSchedulerEvent(null) }
                    onDelete = { () => {
                        schedulerEvent.delete();
                        setSchedulerEvent(null);
                    } }
                />
            ) }
            
        </>
    )
    
}

function Footer() {
    
    const package_infos = __PACKAGE_INFOS__;
    
    return (
        <p className="text-end text-mute">
            <small>
                <a  className="text-dark"
                    href= { `https://www.npmjs.com/package/${ package_infos.name }` } >
                    { package_infos.name }
                </a>
                
                &nbsp;
                (v{ package_infos.version })
            </small>
        </p>
    )
    
}

if (webpack_mode !== 'production') {
    // date stub
    if (url.searchParams.has('today')) {
        Date.now = () => new Date(url.searchParams.get('today')).getTime();
    }
}

createRoot( document.getElementById('app' ) ).render(<App />);
createRoot( document.getElementById('footer' ) ).render(<Footer />);
