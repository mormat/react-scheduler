const { Given, When, Then } = require('@cucumber/cucumber');

const { getEventsManagerScripts } = require('./config');

const { driver, selectTheValuesBelowIn, findElementByCss } = require('./webdriver');

const base_url   = 'http://localhost:9000';

const css_selectors = {
    'events': '.mormat-scheduler-event'
};

When('I open the events manager', function () {
    
    driver.get(base_url + '?action=test');
    
    const scripts = getEventsManagerScripts();
    for (let script of scripts) {
        driver.executeScript(script + ';');
    }
    
});

When('I select the time periods below:', async function (dataTable) {
        
    for (const values of dataTable.hashes()) {
        values['desc'] = values[''];
        delete values[''];
        
        const { desc, ...rowsHash } = values;
        
        await selectTheValuesBelowIn(desc, rowsHash);
    }
        
});

When('I delete {string} Event', async function (string) {
    
    const element = await findElementByCss(
        css_selectors['events'] + `:contains("${string}") button[title="Delete"]`
    );
    
    await element.click();
    
});