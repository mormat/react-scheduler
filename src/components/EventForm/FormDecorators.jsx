import { useState, useCallback, useMemo  } from 'react';
import { utils } from '@mormat/jscheduler_ui';

import { 
    Input, 
    ColorPresets, 
    DateTimePicker 
} from './Widgets';

function withState(
    WrappedComponent, 
    { 
        useDatePicker = false, 
        useColorPicker = false 
    } = {}
) {
    
    return function({ values = {}, onConfirm, onCancel, onDelete, ...otherProps }) {
        
        const [label, setLabel ] = useState( values.label || '');
        
        const [start, setStart ] = useState(
            values.start ?
            utils.format_date('yyyy-mm-dd hh:ii', values.start):
            utils.format_date('yyyy-mm-dd hh:ii', Date.now() )
        );
        const [end,   setEnd ]  = useState(
            values.end ?
            utils.format_date('yyyy-mm-dd hh:ii', values.end):
            utils.format_date('yyyy-mm-dd hh:ii', Date.now() + HOUR_LENGTH )
        );
        const [bgColor, setBgColor] = useState(values.bgColor || '#0288d1');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (onConfirm) {
                onConfirm({label, start, end, bgColor});
            }
        }

        const handleCancel = (e) => {
            e.preventDefault();
            if (onCancel) {
                onCancel();
            }
        }
        
        const handleDelete = onDelete ? (e) => {
            e.preventDefault();
            onDelete();
        } : null;
        
        const labelInput = (
            <Input 
                value    = { label } 
                setValue = { setLabel } 
                type     = "text"
            />
        );

        const startInput = useDatePicker ? 
        (
            <DateTimePicker 
                value      = { start } 
                setValue   = { setStart } 
                dateLocale = { otherProps.dateLocale }
            />      
        ) :
        (
            <Input 
                value    = { start } 
                setValue = { setStart } 
                type     = "datetime-local"
            />
        );

        const endInput =  useDatePicker ? 
        (
            <DateTimePicker 
                value      = { end } 
                setValue   = { setEnd } 
                dateLocale = { otherProps.dateLocale }
            />      
        ) :
        (
            <Input 
                value    = { end } 
                setValue = { setEnd } 
                type     = "datetime-local"
            />
        );

        const bgColorInput = useColorPicker ?
        (
            <>
                <Input 
                    value    = { bgColor } 
                    setValue = { setBgColor } 
                    type     = "color"
                />
                <ColorPresets onSelect = { setBgColor } />
            </>
        ) : (
            <Input 
                value    = { bgColor } 
                setValue = { setBgColor } 
                type     = "color"
            />      
        )
        
        return (
            <WrappedComponent { ...{
                labelInput,                
                startInput,
                endInput,
                bgColorInput,
                handleSubmit,
                handleCancel,
                handleDelete,
                values: { label, start, end, bgColor },
                ...otherProps
            } } />
        )
        
    }
    
}

function withOverlay(WrappedComponent) {
    
    return function(props, somethingElse) {
    
        return (
            <div style = {{
                position: 'fixed',
                top: 0, left: 0, bottom: 0, right: 0,
                zIndex: 999997,
            }} >
                <div style = {{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0, right: 0,
                    backgroundColor: 'white',
                    opacity: 0.7,
                    zIndex: 999998
                }}></div>
                <div style = {{
                    position: 'relative',
                    top: 0, height: '100%',
                    marginLeft:   'auto',
                    marginRight: 'auto',
                    display: 'table',
                    zIndex: 999999
                }} >
                    <div style= {{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                    }} >
                        <WrappedComponent { ...props } />
                    </div>
                </div>
            </div>
        )
        
    }
    
} 

function withPopup(WrappedComponent) {
    
    return function( props ) {

        const handleCancel = (e) => {
            e.preventDefault();
            if (props.onCancel) {
                props.onCancel();
            }
        }

        return (
            <div className="mormat-scheduler-withPopup">

                <a onClick={ handleCancel }>
                    { closeIcon }
                </a>
                
                <div>
                    <WrappedComponent { ... props } />
                </div>
                
            </div>   
        )
    
    }
}

const HOUR_LENGTH = 60 * 60 * 1000;

const closeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" 
        width  = "24"
        height = "24"
        viewBox="0 0 24 24" 
        fill="#fff" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="feather feather-x-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);


export { 
    withOverlay, 
    withState,
    withPopup
}