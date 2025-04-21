
import { withOverlay } from './FormDecorators';

function OkCancelDialog({ 
    message,
    onConfirm,
    onCancel,
}) {
    
    const handleConfirm = (e) => {
        e.preventDefault();
        onConfirm();
    };
    
    const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
    };
        
    return (
        <div>
            <p>
                { message }
            </p>
                    
            <p>
                <button onClick = { handleConfirm }>
                    Ok
                </button>
                &nbsp;
                <button onClick = { handleCancel }>
                    Cancel
                </button>
            </p>
        </div>
           
    )
    
}

export default withOverlay( OkCancelDialog )
    