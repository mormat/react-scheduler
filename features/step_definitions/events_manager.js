const { Given, When, Then } = require('@cucumber/cucumber');

const { getEventsManagerScripts } = require('./config');

const { driver } = require('./webdriver');

const { selectTheValuesBelowIn, findElementByCss } = require('./webdriver');

const { expect } = require('expect');

const base_url   = 'http://localhost:9000';

const css_selectors = {
    'events': '.mormat-scheduler-event'
};

When('I select the dates below:', async function (dataTable) {
        
    for (const values of dataTable.hashes()) {
        values['desc'] = values[''];
        delete values[''];
        
        const { desc, ...rowsHash } = values;
        
        await selectTheValuesBelowIn(desc, rowsHash);
    }
        
});


When('I select the dates below in {string}:', async function (selector, dataTable) {
        
    for (const values of dataTable.hashes()) {
        values['desc'] = values[''];
        delete values[''];
        
        const { desc, ...rowsHash } = values;
        
        await selectTheValuesBelowIn(desc, rowsHash, selector);
    }
        
});

When('I open the events list', async function () {
    
    await driver.get(base_url + '/test.html');
    
    const scripts = getEventsManagerScripts();
    for (let script of scripts) {
        driver.executeScript(script + ';');
    }
    
});

Given('I open the events list with {string} containing:', async function (selector, dataTable) {
    
    await driver.get(base_url + '/test.html');
    
    const value = dataTable.raw().map(t => t.join('\\t')).join('\\n');
    
    const script = `document.querySelector('${selector}').value+='${value}'`;
    
    await driver.executeScript(script);
    
    const scripts = getEventsManagerScripts();
    for (let script of scripts) {
        driver.executeScript(script + ';');
    }
    
});

Then('{string} should contain:', async function (selector, dataTable) {
    
    const element = await findElementByCss(selector);
    
    const value   = await element.getAttribute('value');
    
    const actual  = value.split('\n').map(t => t.split('\t'))
    
    expect(actual).toStrictEqual(dataTable.raw());
    
});

