const { Given, When, Before, Then } = require('@cucumber/cucumber');
const { By, Select  } = require('selenium-webdriver');
const { driver, findElementByCss, findElementsByCss } = require('./webdriver');
const { expect } = require('expect');
const { setFormValues }  = require('./forms');
const { serializeForm }  = require('./webdriver');

const { DataTable } = require('@cucumber/cucumber');

const { until } = require('selenium-webdriver');
const css2xpath = require('css2xpath');


When('I enable {string} with {string}', async function (optionName, optionValue) {
    
    const checkbox = await findElementByCss(
        `tr:has(th:contains('${optionName}')) td [type=checkbox]`
    );
    
    await toggleCheckbox(checkbox, true);
       
    await setFormValues({ [optionName]: optionValue });
       
});

When('I disable {string}', async function (optionName) {

    const checkbox = await findElementByCss(
        `tr:has(th:contains('${optionName}')) td [type=checkbox]`
    );
    
    await toggleCheckbox(checkbox, false);

});

When('I set {string} with {string}', async function (optionName, value) {
    
    const selector = `tr:has(th:contains('${optionName}')) td`;
    
    await selectRadio(value);
});


When('I add an event with:', async function (dataTable) {
    
    await clickOn(`button:contains('Add event')`);
    
    const maxNthEvent = await getMaxValue('data-nth-event', s => Number(s));
    
    const selector = `[data-nth-event="${maxNthEvent}"]`;
    
    await setFormValues(dataTable.rowsHash(), selector);
    
});

When('I edit the {string} event with:', async function (value, dataTable) {
    
    const selector = await getEventWithLabelEquals(value);
    
    await setFormValues(dataTable.rowsHash(), selector);
    
});

When('I remove the {string} event', async function (value) {
    
    const selector = await getEventWithLabelEquals(value);
    
    clickOn(`${selector} button[title="Remove event"]`);
    
});

When('I create an event with:', async function (dataTable) {
           
    await clickOn(`a[title='Add event']`);
    
    await setFormValues(dataTable.rowsHash());
    
    await clickOn(`button:contains('Ok')`);
    
});

When('I update the {string} event with:', async function (value, dataTable) {

    await clickOn("a[title='Edit event']", inEventContaining(value));
    
    await setFormValues(dataTable.rowsHash());
    
    await clickOn(`button:contains('Ok')`);
});

function inEventContaining(value) {
    
    return `[class*="-Event"]:contains("${value}")`;
  
}

When('I delete the {string} event', async function (value) {
    
    await clickOn(`a[title='Edit event']`, inEventContaining(value));
    
    await clickOn(`button:contains("Delete")`, inEventContaining(value));
    
    await confirmDialog("Deleting event ?");
    
});

async function clickOn(selector, parent = 'body')
{
    const element = await findElementByCss(selector, parent);
    
    await element.click();
}

async function confirmDialog(text)
{
    await driver.wait(until.alertIsPresent(), 1000);
    
    let alert = await driver.switchTo().alert();
    expect(await alert.getText()).toBe(text);
    await alert.accept();
}

Then('{string} in the {string} form should equal:', async function (name, selector, dataTable) {
    
    const element = await findElementByCss(
        `${selector} textarea[name="${name}"]`
    );
    
    const value = await element.getAttribute('value');
    
    const actual  = value.split('\n').map(t => t.split('\t'));
    
    expect(actual).toStrictEqual(dataTable.raw());
    
});

Then('{string} in the {string} form should contain:', async function (name, selector, dataTable) {
    
    const element = await findElementByCss(
        `${selector} textarea[name="${name}"]`
    );
    
    const value = await element.getAttribute('value');
    
    const actual = new DataTable(
        value.split('\n').map(t => t.split('\t'))
    );
    
    expect(actual.hashes()).toEqual(
        dataTable.hashes().map(obj => expect.objectContaining(obj))
    );
    
});

async function getEventWithLabelEquals(value) {
    
    const input = `[data-label="label"] input[value="${value}"]`;
    
    return `[data-nth-event]:has(${input})`;
    
}

async function getMaxValue(attr, normalizer = s => s) {
    
    const elements  = await findElementsByCss('[' + attr + ']');
    
    const values = await Promise.all(
        elements.map(elt => elt.getAttribute(attr))
    );
    
    return Math.max(...values.map(normalizer));
    
}

const toggleCheckbox = async (checkbox, checked) => {
    
    const actual = await checkbox.isSelected();
    
    if (checked === undefined) {
        checked = !(actual);
    }
    
    if (checked !== actual) {
        await checkbox.click();
    }
    
}

const selectRadio = async (value, parent) => {
    
    const selector = `input[type=radio][data-label='${value}']`;
    
    const element = await findElementByCss(selector, parent);
    
    await element.click();
    
}
