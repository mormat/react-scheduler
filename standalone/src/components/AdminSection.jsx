
import { useState, Fragment } from 'react';

import { useUniqueId } from '../../../src/utils/dom';

import DateTimePicker   from '../../../src/components/Widget/Form/DateTimePicker';
import DatePicker   from '../../../src/components/Widget/Form/DatePicker';
import RadioChoices from '../../../src/components/Widget/Form/RadioChoices';
import EventsList   from '../../../src/components/EventsManager/EventsList';

import './AdminSection.scss';

function AdminSection( { defaults = {}, namePrefix = '' } ) {
    
    const getDefault = name => defaults[namePrefix + name];
    
    const [activeDate,  setActiveDate]  = useState(!!getDefault('initialDate'));
    const [initialDate, setInitialDate] = useState(getDefault('initialDate'));
    const [initialView, setInitialView] = useState(getDefault('initialView'));
    const [events,      setEvents]      = useState(getDefault('events'));
    
    const [datetime, setDatetime] = useState();
    
    const name = useUniqueId();
    
    return (
        <table className="mormat-scheduler-AdminSection form-table">
            <thead>
                <tr>
                    <th scope="row">
                        Initial date
                    </th>
                    <td>
                        <input type="checkbox" 
                            checked  = { activeDate }
                            onChange = { () => { setActiveDate(!activeDate)} } 
                        />
                        
                        <DatePicker 
                            value    = { initialDate }
                            onChange = { setInitialDate }
                            disabled = { !activeDate }
                            label    = "Initial date"
                        />
                        <br/>
                        <input name     = { namePrefix + "initialDate"}
                               type     = "hidden" 
                               value    = { initialDate } 
                               disabled = { !activeDate }
                        />
                        
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        Initial view 
                    </th>
                    <td>
                        <RadioChoices 
                            choices  = { { day: 'day', week: 'week', month: 'month' } }
                            value    = { initialView }
                            onChange = { setInitialView }
                            name     = { namePrefix + "initialView" }
                            required = { true }
                        />
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        Events
                    </th>
                    <td>
                        
                        <EventsList
                            name     = { namePrefix + "events" }
                            value    = { events }
                            onChange = { setEvents }
                        />
                    </td>
                </tr>
            </thead>
        </table>
    )
    
}

export default AdminSection