
import { useState } from 'react';

const useUniqueId = (function() {
    
    let lastUniqueId = 0;

    return function() {
        const [uniqueId] = useState(() => 'mormat-scheduler-' + lastUniqueId++);

        return uniqueId;
    }
    
})();

export { useUniqueId } 
