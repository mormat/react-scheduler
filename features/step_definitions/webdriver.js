const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { By, Keys, until, Builder, Capabilities, Select, LogInspector } = require('selenium-webdriver');
const css2xpath = require('css2xpath');
const { expect } = require('expect');
const chrome = require("selenium-webdriver/chrome");

const driver = (function() {
    setDefaultTimeout(60 * 1000);
    
    // const capabilities = Capabilities.chrome();
    // capabilities.set('chromeOptions', { "w3c": false });

    const builder = new Builder().withCapabilities({
        'browserName': 'chrome',
        'goog:loggingPrefs': { 'browser':'ALL' },
    });
    
    const options = new chrome.Options();
    options.addArguments("--lang=en");
    builder.setChromeOptions(options)
    
    return builder.build();

}());

const findElementsByCss = async function(selector) {
    
    const attempts = [
        () => By.css(selector),
        () => By.xpath(css2xpath(selector))
    ];
        
    for (let attempt of attempts) {
        try {
            return await driver.findElements(attempt());
        } catch (err) {}
    }        
    
    throw `Invalid css selector '${selector}'`;
    
}

const findElementByCss = async function(selector) {
    
    const attempts = [
        () => By.css(selector),
        () => By.xpath(css2xpath(selector))
    ];
        
    for (let attempt of attempts) {
        try {
            return await driver.findElement(attempt());
        } catch (err) {}
    }        
    
    throw `Invalid css selector '${selector}'`;
    
}

const getPageText = async function() {
    
    const body = await driver.findElement(By.tagName("body"));
    
    return await body.getText();
    
}

When('I click on {string}', async function (string) {
    
    const element = await findElementByCss([
        `a:contains("${string}")`,
        `button[title="${string}"]`,
        `button:contains("${string}")`,
    ].join(','));
    
    element.click();
    
});

Then('I should see {string}', async function (expectedText) {
    
    let pageText = await getPageText();
    
    pageText = pageText.replaceAll('\n', " ");
    
    expect(pageText).toContain(expectedText);
    
});

Then('I should not see {string}', async function (expectedText) {
    
    const pageText = await getPageText();
    
    expect(pageText).not.toContain(expectedText);
});

// I should see only the items checked below
Then('only the items checked below should be visible', async function (dataTable) {
    
    const pageText = await getPageText();
    
    const items = dataTable.rowsHash();
    for (const [text, visible] of Object.entries(items)) {
        if (visible) {
            expect(pageText).toContain(text);
        } else {
            expect(pageText).not.toContain(text);
        }
    }
    
});

When('I fill {string} in {string}', async function (value, name) {
    
    const input = await findElementByCss(`label:contains("${name}") input`);

    input.clear();
    input.sendKeys(value);
    
});

async function selectTheValuesBelowIn(desc, rowsHash) {
    
    for (const name in rowsHash) {
        
        const value = rowsHash[name];
        
        const element = await findElementByCss(
            `label:contains("${desc}") select[name*="${name}"]`
        );

        const select  = new Select(element);
        await select.selectByVisibleText(value);
        
    }
    
}

When('I select the values below in {string}:', async function (desc, dataTable) {
    
    await selectTheValuesBelowIn(desc, dataTable.rowsHash());
    
});

AfterAll(function() {
    // 'fail-fast'
    driver.close();
});

module.exports = { 
    driver, 
    findElementByCss, 
    findElementsByCss, 
    getPageText,
    selectTheValuesBelowIn
} 