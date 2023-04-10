const { Given, When, Then, Before, AfterAll } = require('@cucumber/cucumber');
const logging = require('selenium-webdriver/lib/logging');
const { driver } = require('./webdriver');
const { expect } = require('expect');

let browserLogs = {}

Before(function() {
    browserLogs = [];
});

async function updateBrowserLogs()
{
    const logs = await driver.manage().logs().get(logging.Type.BROWSER);
    
    for (let log of logs) {
        if (log.message.startsWith('webpack://')) {
            continue;
        }
        browserLogs.push(log);
    }
}

async function logsShouldContainInfos(expectedInfos) {
    
    await updateBrowserLogs();
    
    const actual = browserLogs
        .filter((log) => log.level.name_ === 'INFO')
        .map(i => i.message.split(/\s+/).join(' '))
        .join('\n');
    
    for (const expectedInfo of expectedInfos) {
        expect(actual).toContain(expectedInfo.trim());
    }
    
}

Then('the logs should contain the info:', async function (docString) {
    await logsShouldContainInfos([docString]);
});

Then('the logs should contain the infos:', async function (dataTable) {
    
    const expectedInfos = dataTable.raw().map(i => i[0]);
    
    await logsShouldContainInfos(expectedInfos);
    
});