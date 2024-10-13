const { Given, When, Then } = require('@cucumber/cucumber');
const { expect }  = require('expect');

const urlParams = new URLSearchParams();

Given('today is {string}', function (value) {
    
    urlParams.set('today', value);
    
});

When('I open {string} page', async function (pageName) {
    
    const url = `http://localhost:9000/${pageName}.html?` + urlParams;
    
    await this.driver.get( url );
    
});

Then(
    '{string} should be loaded from {string} to {string}', 
    async function (url, startDate, endDate) {

        const start = (new Date(startDate)).getTime();
        const end   = (new Date(endDate)).getTime();
    
        const expectedText = `loading '${url}?start=${start}&end=${end}'`;

        const pageText = await this.getPageText();

        expect(pageText).toContain(expectedText);

    }
);

Then('the scheduler header should contains:', async function (dataTable) {
    
    const pageText = await this.getPageText('.mormat-scheduler-Header');

    for (const [expectedText] of dataTable.raw()) {
        expect(pageText).toContain(expectedText);
    }
    
});
