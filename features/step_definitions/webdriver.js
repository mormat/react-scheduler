const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { By, until, Builder, Capabilities, Select, LogInspector } = require('selenium-webdriver');
const { Key } = require('selenium-webdriver');
const css2xpath = require('css2xpath');
const { expect } = require('expect');
const chrome = require("selenium-webdriver/chrome");
const { JSDOM } = require("jsdom");
const formSerialize = require('form-serialize');

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

const findElementByCss = async function(selector, parent = driver) {
    
    const attempts = [
        () => By.css(selector),
        () => By.xpath(css2xpath(selector))
    ];
        
    for (let attempt of attempts) {
        try {
            return await parent.findElement(attempt());
        } catch (err) {}
    }        
    
    throw `Invalid css selector '${selector}'`;
    
}

const getPageText = async function() {
    
    const body = await driver.findElement(By.tagName("body"));
    
    return await body.getText();
    
}

async function clickOn(text, root = 'body') {
    
    const element = await findElementByCss([
        `a:contains("${text}")`,
        `a[title="${text}"]`,
        `button[title="${text}"]`,
        `button:contains("${text}")`,
    ].map(s => root + ' ' + s).join(','));
    
    await element.click();
    
}

When('I click on {string}', (string) => clickOn(string));

When('I click on {string} in {string}', (string, selector) => clickOn(string, selector));

Then('I should see {string}', async function (expectedText) {
    
    let pageText = await getPageText();
    
    pageText = pageText.replaceAll('\n', " ");
    
    expect(pageText).toContain(expectedText);
    
});

Then('I should not see {string}', async function (expectedText) {
    
    const pageText = await getPageText();
    
    expect(pageText.replace(/\s+/g,' ')).not.toContain(expectedText);
});

Then('I should see {string} in {string}', async function (text, selector) {
    
    expect(await getTextByCss(selector)).toContain(text);
    
});

async function getTextByCss(selector) {
    
    const elements = await findElementsByCss(selector);
    
    if (elements.length === 0) {
        throw `No elements found matching '${selector}'`
    }
    
    let text = '';
    for (const element of elements) {
        text += await element.getText();
    }

    return text.replace(/\s+/g,' ');
    
}

async function getHtmlByCss(selector)
{
    const elements = await findElementsByCss(selector);
    
    if (elements.length === 0) {
        throw `No elements found matching '${selector}'`
    }
    
    let html = '';
    for (let element of elements) {
        html += await element.getAttribute('outerHTML');
    }
    
    return html;
}

Then('the value {string} of the {string} form should equals:', async function (valueName, formSelector, dataTable) {
    
    const expected = dataTable.hashes();
    
    const header = dataTable.raw().at(0);
    
    let html = await getHtmlByCss(formSelector + ` [name^="${valueName}["]`);
    
    html = html.replaceAll(` name="${valueName}[`, ' name="rows[');
    
    const { window } = new JSDOM(`<!DOCTYPE html><div>
        <form id="form">${html}</form>
        </div>`);
    
    const form = window.document.getElementById('form');
    
    const { rows } = formSerialize(form, true);
        
    const actual = rows.filter(t => t).map(e => {
        const defaults = Object.fromEntries(header.map(k => [k, '']));
        return {...defaults, ...e}
    });
        
    expect(actual).toStrictEqual(expected);
    
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

async function clearInput(inputElement) {
    const oldValue = await inputElement.getAttribute('value');
    await inputElement.sendKeys(Key.BACK_SPACE.repeat(oldValue.length));
    
    // inputElement.clear() does not seem to trigger input change !
}

When('I fill {string} in {string}', async function (value, name) {
    
    const input = await findElementByCss(`label:contains("${name}") input`);

    await clearInput(input);
    input.sendKeys(value);
    
});

When('I replace {string} with {string}', async function (oldValue, newValue) {
    
    const input = await findElementByCss(`input[value="${oldValue}"]`);
    
    await clearInput(input);
    await input.sendKeys(newValue);
    
});


async function selectTheValuesBelowIn(desc, rowsHash, selector = 'body') {
    
    for (const name in rowsHash) {
        
        const value = rowsHash[name];
        
        const element = await findElementByCss(
            selector + ` label:has(span[text()="${desc}"]) select[title*="${name}"]`,
        );

        const select  = new Select(element);
        await select.selectByVisibleText(value);   
    }
    
}

When('I select the values below in {string}:', async function (desc, dataTable) {
    
    await selectTheValuesBelowIn(desc, dataTable.rowsHash());
    
});

When('I confirm {string}', async function (text) {
    
    await driver.wait(until.alertIsPresent(), 1000);
    
    let alert = await driver.switchTo().alert();
    expect(await alert.getText()).toBe(text);
    await alert.accept();
});

AfterAll(async function() {
    if (!process.argv.includes('--fail-fast')) {
        driver.close();
    }
});

module.exports = { 
    driver, 
    findElementByCss, 
    findElementsByCss, 
    getPageText,
    selectTheValuesBelowIn,
    clickOn
} 