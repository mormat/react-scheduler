const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { By, until, Builder, Capabilities, Select, LogInspector } = require('selenium-webdriver');
const { Key } = require('selenium-webdriver');
const css2xpath = require('css2xpath');
const { expect } = require('expect');
const chrome = require("selenium-webdriver/chrome");
const { JSDOM } = require("jsdom");
var serialize = require('form-serialize');

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

const findElementsByCss = async function(selector, parent = driver) {
    
    if (typeof(parent) === "string") {
        selector = parent + ' ' + selector;
        parent = driver;
    }
    
    const attempts = [
        () => By.css(selector),
        () => By.xpath(css2xpath(selector))
    ];
        
    for (let attempt of attempts) {
        try {
            return await parent.findElements(attempt());
        } catch (err) {}
    }        
    
    throw `Invalid css selector '${selector}'`;
    
}

const findElementByCss = async function(selector, parent = driver) {

    if (typeof(parent) === "string") {
        selector = parent + ' ' + selector;
        parent = driver;
    }

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

Then('I should see in {string}:', async function (selector, docString) {
    
    expect(await getTextByCss(selector)).toContain(docString.trim());
    
});
        
Then('I should see the element {string}', async function (selector) {
    const elements = await findElementsByCss(selector);
    
    expect(elements.length).toBeGreaterThanOrEqual(1);
});

Then('I should not see the element {string}', async function (selector) {
    const elements = await findElementsByCss(selector);
    
    expect(elements.length).toBe(0);
});

async function getTextByCss(selector) {
    
    const elements = await findElementsByCss(selector);
    
    if (elements.length === 0) {
        throw `No elements found matching '${selector}'`
    }
    
    let texts = [];
    for (const element of elements) {
        texts.push(await element.getText());
    }

    return texts.join(' ').replace(/\s+/g,' ');
    
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

Then('I should see {string} in the {string} form', async function (expectedText, selector) {
    
    const actualText = await getFormText(selector);
    
    expect(actualText.replace(/\s+/g,' ')).toContain(expectedText.trim());
    
});

Then('I should see in the {string} form:', async function (selector, docString) {
    
    const actualText = await getFormText(selector);
    
    expect(actualText.replace(/\s+/g,' ')).toContain(docString.trim());

});

Then('I should not see {string} in the {string} form', async function (expectedText, selector) {
    
    const actualText = await getFormText(selector);
    
    expect(actualText.replace(/\s+/g,' ')).not.toContain(expectedText.trim());
    
});

Then('I should see all items below in the {string} form:', async function (selector, dataTable) {
    
    const actualText = await getFormText(selector);
    
    for (const [expectedText] of dataTable.raw()) {
        expect(actualText.replace(/\s+/g,' ')).toContain(expectedText.trim());
    }
    
});

Then('the {string} form should contain:', async function (selector, dataTable) {
    
    const values = await serializeForm(selector);
    
    expect(values).toEqual(
        expect.objectContaining(dataTable.rowsHash())
    );
    
});

Then('the {string} form should not contain any {string}', async function (selector, prop) {
    
    const values = await serializeForm(selector);
    
    expect(values).not.toHaveProperty(prop);
    
});


async function serializeForm(selector) {
    
    const document = await getDocument();
    
    const form = document.querySelector(selector);
    
    return serialize(form, { hash: true, empty: true });
    
}

async function getDocument() {
    
    await driver.executeScript(`
        for (const select of document.querySelectorAll('select')) {
            for (const option of select.options) {
                if (option.index === select.selectedIndex) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            }
        }
        for (const radio of document.querySelectorAll('input[type="radio"]')) {
            if (radio.checked) {
                radio.setAttribute('checked', 'checked');
            } else {
                radio.removeAttribute('checked');
            }
        }
    `);
    
    let html = await driver.executeScript(`
        return document.documentElement.outerHTML;
    `);
    
    html = html.replace(/\</g, ' <'); // add spaces between tags
    
    const dom = new JSDOM(html);
    
    return dom.window.document;
    
}

async function getFormText(formSelector) {
    
    const document = await getDocument();
    
    const converters = {
        'input[type=text]':     input => input.value,
        'input[type=checkbox]': input => input.checked ? '[X] ': '[ ]',
        'input[type=radio]':    input => input.checked ? '(X)': '( )',
        'select':               select => {
            const selectedOption = select.options[select.selectedIndex];
            return selectedOption ? selectedOption.text : '';
        }
    };
    
    for (const selector in converters) {
        var elements = document.querySelectorAll(formSelector + ' ' + selector);
        for (const element of elements) {
            const html = converters[selector](element);
            element.replaceWith(html);
        }
    }
    
    return [...document.querySelectorAll(formSelector)]
        .map(form => form.innerText || form.textContent)
        .join(' ');

}

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
    getTextByCss,
    clickOn,
    serializeForm
} 