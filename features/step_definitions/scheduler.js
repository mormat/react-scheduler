const { 
    When, 
    Then
} = require('@cucumber/cucumber');

const { expect }  = require('expect');

When('I resize the {string} event to {string}', async function (eventName, toHour) {
    
    const eventElement = await this.events.getElement(eventName);
   
    await this.daysview.resizeElementUntilHour(eventElement, toHour);
    
});

When('I drag the {string} event to {string} at {string}', async function (eventName, toDate, atHour) {

    const eventElement = await this.events.getElement(eventName);

    await this.daysview.dragElementToDateAtHour(
        eventElement,
        toDate,
        atHour
    );

});

Then('the scheduler should be in day view', async function () {

    await this.getElement( this.daysview.selector );

    const columns = await this.daysview.countColumns();
    
    expect(columns).toBe(1);
    
});

Then('the scheduler should be in week view', async function () {

    await this.getElement( this.daysview.selector );

    const columns = await this.daysview.countColumns();
    
    expect(columns).toBe(7);

});

Then('the scheduler should be in month view', async function () {
    
    await this.getElement( this.monthview.selector );
    
});

Then('the {string} event should not be displayed', async function (eventName) {
    
    const elements = await this.events.findElements(eventName);
    
    expect(elements.length).toBe(0);
    
});

Then('the {string} event should be displayed at {string} from {string} to {string}', async function (eventName, atDate, fromHour, toHour) {

    const eventElement = await this.events.getElement(eventName);

    await this.daysview.expectElementAtDayFromHourToHour(
        eventElement,
        atDate, 
        fromHour, 
        toHour
    );

});

Then('the scheduler header should contains:', async function (dataTable) {
    
    const pageText = await this.getPageText('.mormat-scheduler-Header');

    for (const [expectedText] of dataTable.raw()) {
        expect(pageText).toContain(expectedText);
    }
    
});
