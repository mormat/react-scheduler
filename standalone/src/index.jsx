
import React from 'react';
import ReactDOM from 'react-dom';
import { Scheduler, EventsList } from '../../src/index';

import AdminSection from './components/AdminSection';

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

function renderAdminSection(target, props = {})
{
    for (const domElement of findElements(target)) {

        const defaults = serializeForm(domElement);
        
        console.log('defaults', defaults);
        
        const reactElement = React.createElement(
            AdminSection, 
            { ...props, defaults }
        );
        ReactDOM.render(reactElement, domElement);
    }
}

function serializeForm(domElement)
{
    const selectors = ['input', 'textarea'];
    
    const children = [...domElement.querySelectorAll(selectors.join(','))];
    
    return Object.fromEntries(children.map(i => [i.name, i.value]));
}

export { renderScheduler, renderEventsList, renderAdminSection }