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

When('I open the {string} example', async function (exampleName) {
    
    const url = `http://localhost:9000/examples.html?` + urlParams;
    
    await this.driver.get( url );
    
    await this.clickOn(`a:contains("${exampleName}"")`);
    
});

When('I click on {string}', async function (clickableText) {
    
    await this.page.clickOn(clickableText);
    
});

When('I wait until I see {string}', async function (expectedText) {

    const selector = `:contains("${expectedText}")`;
    
    await this.waitForText(expectedText);
    
});

Then('I should see {string}', async function (expectedText) {
    
    const pageText = await this.getPageText();
    
    expect(pageText).toContain(expectedText);
    
});

Then('I should see :', async function (dataTable) {
        
    const pageText = await this.getPageText();

    for (const [expectedText] of dataTable.raw()) {
        expect(pageText).toContain(expectedText);
    }

});

Then('I should see a {string} tooltip', async function (string) {
    
    await this.getElement(`[title="${string}"]`);
    
});

Then('I should not see {string}', async function (expectedText) {
        
    const pageText = await this.getPageText();
    
    expect(pageText).not.toContain(expectedText);
    
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

Then(
    'I should not see {string} \\(case insensitive)', 
    async function (expectedText) {
        const pageText = await this.getPageText();
        expect(pageText.toLowerCase()).not.toContain(expectedText.toLowerCase());
    }
);

Then('{string} should be checked', function (label) {
    
    this.getElement(
        `label:contains("${label}") input[type=radio][checked]`
    );
    
});

