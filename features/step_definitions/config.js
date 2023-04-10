const { Given, When, Then, Before, AfterAll } = require('@cucumber/cucumber');

let config     = {};
let preScripts = [];

Before(function() {
    config     = {};
    preScripts = [];
});

Given('the date today is {string}', function (string) {
    
    const timestamp = new Date(string).getTime();
    
    preScripts.push(`Date.now = function() { return ${timestamp} };`);
    
});

Given('the configuration contains the following events:', function (dataTable) {
    
    const events = config['events'] || [];
    
    config['events'] = events.concat(dataTable.hashes());
    
});

Given('the configuration is empty', function () {
    config = {}
});

Given('the configuration contains:', function (dataTable) {
    config = { ...dataTable.rowsHash(), ...config }
});

Given('{string} in configuration equals:', function (string, docString) {
    config[string] = docString;
});

function serializeConfig(config) {
    
    const items = Object.keys(config).map(key => {
        let value;
        if (key.startsWith('on')) {
            value = config[key];
        } else if (['true', 'false'].includes(config[key])) {
            value = config[key];
        } else {
            value = JSON.stringify(config[key]);
        }
        return `"${key}":${value}`;
    });
    
    return items.length > 0 ? '{' + items.join(',') + '}' : '';
    
}

function getSchedulerScripts()
{
    const scripts = [...preScripts];
    
    const serializedConfig = serializeConfig(config);
    
    if (serializedConfig) {
        scripts.push(`mormat_scheduler.bindScheduler(document.getElementById('root'),${serializedConfig})`);
    } else {
        scripts.push("mormat_scheduler.bindScheduler(document.getElementById('root'))");
    }
    
    return scripts;
}

function getEventsManagerScripts()
{
    const scripts = [...preScripts];
    
    const serializedConfig = serializeConfig(config);
    
    if (serializedConfig) {
        scripts.push(`mormat_scheduler.bindEventsManager(document.getElementById('root'),${serializedConfig})`);
    } else {
        scripts.push("mormat_scheduler.bindEventsManager(document.getElementById('root'))");
    }
    
    return scripts;
}

module.exports = { getSchedulerScripts, getEventsManagerScripts }