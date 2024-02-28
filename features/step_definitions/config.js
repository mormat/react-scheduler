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
    
    let events = JSON.parse(config['events'] || '[]');
    
    events = events.concat(dataTable.hashes());
    
    config['events'] = JSON.stringify(events);
    
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

Given('{string} in configuration equals the csv below:', function (key, dataTable) {
    const csv = dataTable.raw().map(r => r.join('\t')).join('\n');
    
    config[key] = JSON.stringify(csv);
    
  });

function serializeConfig(config) {
    
    const items = Object.entries(config)
        .filter(([_, v]) => v !== 'undefined')
        .map(([k, v]) => `"${k}":${v}`);
    
    return items.length > 0 ? '{' + items.join(',') + '}' : '';
    
}

function getSchedulerScripts()
{
    const scripts = [...preScripts];
    
    const serializedConfig = serializeConfig(config) || '{}';
    
    scripts.push(
        `renderComponent(mormat_react_scheduler.Scheduler,${serializedConfig})`
    );
    
    return scripts;
}

function getEventsManagerScripts()
{
    const scripts = [...preScripts];
    
    const serializedConfig = serializeConfig(config) || '{}';
    
    scripts.push(
        `renderComponent(mormat_react_scheduler.EventsList,${serializedConfig})`
    );
    
    return scripts;
}

module.exports = { getSchedulerScripts, getEventsManagerScripts }