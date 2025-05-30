const { 
    When,
    Then
} = require('@cucumber/cucumber');

const { expect }  = require('expect');

When('I create an event with:', async function (dataTable) {

    await this.eventsForm.createEvent( dataTable.rowsHash() );

});

When('I edit the {string} event', async function (eventName) {
        
    await this.eventsForm.editEvent(eventName);
        
});


When('I update the {string} event with:', async function (eventName, dataTable) {

    await this.eventsForm.updateEvent( eventName, dataTable.rowsHash() );

});

When('I delete the {string} event', async function (eventName) {
    
    await this.eventsForm.deleteEvent( eventName );
           
});

Then('the event form should contains:', async function (dataTable) {
    
    const values = dataTable.rowsHash();
    
    for (const [labelText, expectedValue] of Object.entries(values)) {   
    
        const actualValue = await this.eventsForm.getFormValue(labelText);
        
        expect(expectedValue).toBe(actualValue);
        
    };
    
});

Then(
    'I should see {string} in the {string} field of the event form', 
    async function (expectedText, fieldLabel) {
        const pageText = await this.getPageText(
            `label:contains("${fieldLabel}")`
        );

        expect(pageText).toContain(expectedText);
    }
);
