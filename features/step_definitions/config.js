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

Given('{string} equals:', function (selector, dataTable) {
    
    const value = dataTable.raw().map(t => t.join('\\t')).join('\\n');
    
    const script = `document.querySelector('${selector}').value+='${value}'`;
    
    preScripts.push(script);
    
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

Given('the {string} form contains:', function (selector, dataTable) {
    
    const values = dataTable.rowsHash();
    
    for (const name in values) {

        const value = values[name];

        const script = `
            var input = document.createElement("input");

            input.setAttribute("type", "text");
        
            input.setAttribute("name", "${name}");

            input.setAttribute("value", "${value}");
        
            document.querySelector('${selector}').appendChild(input);
        `;
        
        preScripts.push(script);
    }
    
});


Given('{string} in the {string} form equal:', function (name, selector, dataTable) {
    
    const value = dataTable.raw().map(t => t.join('\\t')).join('\\n');
    
    const script = `
    
        var div = document.createElement("div");
        div.innerHTML = '<textarea name="${name}">${value}</textarea>',
    
        document.querySelector('${selector}').appendChild(div);
    `;
    
    preScripts.push(script);
    
});

Given('{string} in configuration contains the values below:', function (key, dataTable) {
    
    config[key] = JSON.stringify(dataTable.rowsHash());
    
});

Given('{string} in configuration is undefined', function (key) {
    
    delete config[key];
    
});

const getPreScripts = () => preScripts;

module.exports = { getSchedulerScripts, getEventsManagerScripts, getPreScripts }