import { useState, useEffect, useRef } from 'react';

let lastUniqueId = 1;

const cssNamespace = 'mormat-scheduler-';

const layoutSizes = {}

function useUniqueId() {

    const [uniqueId] = useState(() => cssNamespace + lastUniqueId++);

    return uniqueId;

}

function useLayoutSize(schedulerOptions) {

    const selector = `#${schedulerOptions.id} .mormat-scheduler-Widget-withExtensibleHeader > :nth-child(2)`;

    const [size, setSize] = useState(
        schedulerOptions.id in layoutSizes ? 
        layoutSizes[schedulerOptions.id]:
        {width: 0, height: 0}
    );

    const [ticks, setTicks] = useState(0);

    const refreshSize = () => {
        const element = document.querySelector(selector);

        if (element) {
            const size = {
                height: element.clientHeight,
                width:  element.clientWidth
            }

            layoutSizes[schedulerOptions.id] = size;

            setSize(size);
        }
        
    }

    useEffect(() => {

        window.addEventListener('resize', refreshSize);

        setTicks(ticks + 1);

        return function() {
            window.removeEventListener('resize', refreshSize);
        }
    }, []);

    useEffect(() => {
        refreshSize();
    }, [ticks]);

    return size;

}

const getClassName = (suffix) => cssNamespace + suffix

export { useUniqueId, useLayoutSize }
export { getClassName }