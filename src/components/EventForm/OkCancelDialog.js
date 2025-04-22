
import { withOverlay } from './FormDecorators';

import { Button } from './Widgets';

function OkCancelDialog({ 
    message,
    onConfirm,
    onCancel,
    translations = {}
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
        <div className="mormat-scheduler-OKCancelDialog">
            <p>
                { message }
            </p>
                    
            <p>
                <Button onClick = { handleCancel }>
                    { translations['cancel_btn'] || 'Cancel' }
                </Button>
                &nbsp;
                <Button onClick = { handleConfirm } variant="primary">
                    { translations['ok_btn'] || 'Ok' }
                </Button>
            </p>
        </div>
           
    )
    
}

export default withOverlay( OkCancelDialog )
    