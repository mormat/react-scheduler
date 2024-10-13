import { useState, useCallback, useMemo  } from 'react';
import { utils } from '@mormat/jscheduler_ui';

import { useContext } from 'react';
import { InputPropsContext } from './Contexts';

function withState(WrappedComponent) {
    
    return function({ values = {}, onConfirm, onCancel, onDelete, ...otherProps }) {
        
        const [label, setLabel ] = useState( values.label || '');
        
        const [start, setStart ] = useState(
            values.start ?
            utils.format_date('yyyy-mm-dd hh:ii', values.start):
            ''
        );
        const [end,   setEnd ]  = useState(
            values.end ?
            utils.format_date('yyyy-mm-dd hh:ii', values.end):
            ''        
        );
        const [bgColor, setBgColor] = useState(values.bgColor || 'lightgray');

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

        const handleDelete = (e) => {
            e.preventDefault();
            if (onDelete) {
                onDelete();
            }
        }
        
        const labelInput = (
            <Input 
                value    = { label } 
                setValue = { setLabel } 
                type     = "text"
            />
        );

        const endInput = (
            <Input 
                value    = { end } 
                setValue = { setEnd } 
                type     = "datetime-local"
            />
        );

        const startInput = (
            <Input 
                value    = { start } 
                setValue = { setStart } 
                type     = "datetime-local"
            />
        );

        const bgColorInput = (
            <Input 
                value    = { bgColor } 
                setValue = { setBgColor } 
                type     = "color"
            />        
        );
        
        return (
            <WrappedComponent { ...{
                labelInput,                
                startInput,
                endInput,
                bgColorInput,
                handleSubmit,
                handleCancel,
                handleDelete,
                ...otherProps
            } } />
        )
        
    }
    
}

function withOverlay(WrappedComponent) {
    
    return function(props) {
    
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

function Input({ value, setValue, ...otherProps }) {
    
    const inputProps = useContext(InputPropsContext);
    
    return (
        <input 
            value    = { value }
            onChange = { e => setValue(e.target.value) }
            { ...otherProps }
            { ...inputProps }
        />
    );
    
}

export { withOverlay, withState }