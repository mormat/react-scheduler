const { setDefaultTimeout }  = require('@cucumber/cucumber');
const { Given, When, Then, Before } = require('@cucumber/cucumber');

require('@mormat/jscheduler_ui/features/step_definitions/common/driver');
require('@mormat/jscheduler_ui/features/step_definitions/common/events');
require('@mormat/jscheduler_ui/features/step_definitions/common/scheduler');

setDefaultTimeout( 60 * 1000 );

Before(async function() {
    
    this.driver.manage().window().setRect({width: 1200, height: 1024});
    
});

When('I fill the values below:', async function (dataTable) {
    
    const values = dataTable.rowsHash();
    for (const k of ['start', 'end']) {
        values[k] = values[k].replaceAll('/','').replace(' ', '\t');
    }
    
    for (const [label, value] of Object.entries(values)) {
        const element = await this.getElement(`label:contains("${label}")`);
        await element.click();
        await element.sendKeys(value);
    }
});
