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
    
    for (const [label, value] of Object.entries(values)) {   
        
        const element = await this.getElement(`label:contains("${label}")`);
        await element.click();
        
        const target = await element.getAttribute('for');
        const input = target ? 
            await this.getElement('#' + target) : 
            await this.getElement(  'input', element )
        ; 
        sendKeys( input, value );
        
    }
    
});

async function sendKeys(field, value) {

    const type = await field.getAttribute('type');
    if (type === 'datetime-local') {
        await field.clear();
        const keys = value.replaceAll('/','').replace(' ', '\t');
        field.sendKeys( keys );
        return;
    }
    
    await field.clear();
    await field.sendKeys( value );
    
}
