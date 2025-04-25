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

Then(
    'I should see {string} in field {string}', 
    async function (expectedText, fieldLabel) {
        const pageText = await this.getPageText(
            `label:contains("${fieldLabel}")`
        );

        expect(pageText).toContain(expectedText);
    }
);

Then('the form should contains', async function (dataTable) {
    
    const values = dataTable.rowsHash();
    
    for (const [description, expectedValue] of Object.entries(values)) {   
        
        const label = await this.getElement(`label:contains("${description}")`);
        
        const fields = await this.findElements(
            [
                'input[type=text]',
                'select option:checked',
                'input[type=radio]:checked',
            ].join(','),
            label
        );
        
        const actualValues = [];
        for (const field of fields) {       
            const tagName = await field.getTagName();
            if (tagName === 'input') {
                actualValues.push(await field.getAttribute('value'));
            }
            
            if (tagName === 'option') {
                actualValues.push(await field.getText());
            }
        }
        
        const actualValue = actualValues.join(' ');
        expect(expectedValue).toBe(actualValue);
        
    };
    
});

Then(
    'I should not see {string} \\(case insensitive)', 
    async function (expectedText) {
        const pageText = await this.getPageText();
        expect(pageText.toLowerCase()).not.toContain(expectedText.toLowerCase());
    }
);


