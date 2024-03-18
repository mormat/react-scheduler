const { Then } = require('@cucumber/cucumber');

const { driver } = require('./webdriver');

const { expect } = require('expect');

Then('I should see {string} in notifications', async function (text) {
    
    const actual = await driver.executeScript('return window.notifications || "rien du tout";');

    expect(actual).toContain(text);
    
});

Then('I should see in notifications:', async function (docString) {
    
    const actual = await driver.executeScript('return window.notifications || "";');
    
    expect(actual).toContain(docString.trim());
     
});

Then('I should see all the items below in notifications:', async function (dataTable) {
    
    const actual = await driver.executeScript('return window.notifications || "";');
    
    for (const [text] of dataTable.raw()) {
        expect(actual).toContain(text.trim());
    }
    
});

Then('I should see text matching {string} in notifications', async function (regex) {
    
    const actual = await driver.executeScript('return window.notifications || "";');
    
    expect(actual).toEqual(expect.stringMatching(regex));
    
});