
import React from 'react';
import ReactDOM from 'react-dom';
import { Scheduler, EventsList } from './index';

function App() {
    
    return (
        <div>Hello World</div>
    )
}

function findElements(target) {
    if (typeof target === 'string') {
        return document.querySelectorAll(target);
    }
    return [target];
}

function renderScheduler(target, props = {} ) 
{
    for (const domElement of findElements(target)) {
        const reactElement = React.createElement(Scheduler, props);
        ReactDOM.render(reactElement, domElement);
    }
}

function renderEventsList(target, props = {} ) 
{
    let { targetElement } = props
    if (typeof targetElement === 'string' || targetElement instanceof String) {
        targetElement = document.querySelector(targetElement);
    }
    
    for (const domElement of findElements(target)) {
        const reactElement = React.createElement(
            EventsList, 
            { ...props, targetElement }
        );
        ReactDOM.render(reactElement, domElement);
    }
}


export { renderScheduler, renderEventsList }