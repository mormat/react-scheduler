const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

const { Rectangle } = require('../../dist/utils/geom.js');

const { getSchedulerScripts } = require('./config');

const { driver, findElementByCss, findElementsByCss  } = require('./webdriver');

const { getPageText, getTextByCss } = require('./webdriver');

const { clickOn } = require('./webdriver');

const base_url  = 'http://localhost:9000';

const css_selectors = {
    'view_buttons': '.mormat-scheduler-Widget-ToggleButtonGroup button',
    'events':       '[class*="-Event"]'
};

async function openScheduler() {
    
    await driver.get(base_url + '/test.html');
    
    const scripts = getSchedulerScripts();
    for (let script of scripts) {
        await driver.executeScript(script + ';');
    }
    
}

async function setViewMode(viewMode) {
    
    const element = await findElementByCss(
        css_selectors['view_buttons'] + `:contains("${viewMode}")`
    )
    
    element.click();
    
}

async function getViewMode() {
    
    const element = await findElementByCss(
        css_selectors['view_buttons'] + '[data-checked="true"]'
    );
    
    return await element.getText();
    
}

When('I open the scheduler', async function () {
    await openScheduler();
});

When('I open the scheduler in {string} view', async (string) => {
    
    await openScheduler();
    
    await setViewMode(string);
    
});

When('I move the {string} event to {string}', async function (caption, date) {
    
    const selectors = {    
        'subject': css_selectors['events'] + `:contains("${caption}") [data-role="header"]`,
        'day':     `[data-day="${date}"]`
    }
    
    const rects = {}, elements = {};
    for (const k in selectors) {
        elements[k] = await findElementByCss(selectors[k]);
        rects[k]    = new Rectangle(await elements[k].getRect());
    }
    
    const target = rects['day'].getCenter();
    
    const offset = {
        x: Math.round(target.x - rects['subject'].x),
        y: Math.round(target.y - rects['subject'].y),
    }
    
    const actions = driver.actions({async: true});
    const draggable = elements['subject'];
    await actions.dragAndDrop(draggable, offset).perform();
    
});


When('I move the {string} event to {string} at {string}', async function (caption, date, time) {
    
    const elements = {    
        'subject': css_selectors['events'] + `:contains("${caption}")`,
        'hour':    `[data-hour="${time}"]`,
        'day':     `[rowspan][data-day="${date}"]`
    }
    
    const rects = {};
    for (const k in elements) {
        elements[k] = await findElementByCss(elements[k]);
        rects[k]    = await elements[k].getRect();
    }
    
    // border size of hour is 1px
    rects['hour'].y += 1;
    
    const offset = {
        x: Math.round(rects['day'].x  - rects['subject'].x),
        y: Math.round(rects['hour'].y - rects['subject'].y)
    }
        
    const draggable = elements['subject'];
    const actions = driver.actions({async: true});
    await actions.dragAndDrop(draggable, offset).perform();
    
});

Then('the current view should be {string}', async function (expected) {
    
    const actual = await getViewMode();
    if (actual.toLowerCase() !== expected.toLowerCase()) {
        throw `Current view mode should be "${expected}" (got "${actual}" instead)`;
    }
});

Then('I should see the {string} event in {string} at {string}', async function (eventName, day, hour) {
    
    const text = await getTextByCss(`[data-day=${day}]`);
    
    expect(text).toContain(eventName);
    expect(text).toContain(hour);
    
});

Then('I should not see the {string} event in {string} at {string}', async function (eventName, day, hour) {

    const text = await getTextByCss(`[data-day=${day}]`);
    
    if (text.includes(eventName)) {
        expect(text).not.toContain(hour);
    }
});

Then('I should see the {string} event in {string}', async function (eventName, day) {
    
    const text = await getTextByCss(`[data-day="${day}"],[data-event-from^="${day}"]`);
    
    expect(text).toContain(eventName);
});

Then('I should not see the {string} event in {string}', async function (eventName, day) {
    
    const text = await getTextByCss(`[data-day="${day}"],[data-event-from^="${day}"]`);
    
    expect(text).not.toContain(eventName);
    
});

Then('the {string} event should be displayed from {string} to {string}', async function  (eventName, from, to) {
    
    const subject = await findElementByCss(
        css_selectors['events'] + `:contains("${eventName}")`
    );
    
    const startLine = await findElementByCss(`[data-hour="${from}"]`);
    const endLine   = await findElementByCss(`[data-hour="${to}"]`);
    
    const subjectRect = new Rectangle(await subject.getRect());
    const startRect   = new Rectangle(await startLine.getRect());
    const endRect     = new Rectangle(await endLine.getRect());
    
    expect(Math.abs(startRect.top - subjectRect.top)).toBeLessThan(1.5);
    expect(Math.abs(endRect.top - subjectRect.bottom)).toBeLessThan(1.5);
    
});

// I should see hours from {string} to {string}
Then('hours from {string} to {string} should be displayed', async function (min, max) {
    
    const pageText = await getPageText();
    
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0') + ':00'; 
        
        if (min <= hour && hour <= max) {
            expect(pageText).toContain(hour);
        } else {
            expect(pageText).not.toContain(hour);
        }
    }
});



// I should see the events below only in the corresponding day
Then('the events below should be displayed only in the corresponding day', async (dataTable) => {
   
    const daysRects = {}
    const elements = await findElementsByCss('[data-droppable-type="timeline"] [data-day]');
    for (const element of elements) {
        const day = await element.getAttribute('data-day');
        daysRects[day] = new Rectangle(await element.getRect());
    }
    
    for (const [label, daysAsString] of Object.entries(dataTable.rowsHash())) {
        
        const expectedDays = daysAsString.split(',');
        for (let expectedDay of expectedDays) {
            if (!(expectedDay in daysRects)) {
                throw `Day ${expectedDay} is not displayed`;
            }
        }
        
        const selector = css_selectors['events'] + `:contains("${label}")`;
        const subjects = await findElementsByCss(selector);
        
        for (let day in daysRects) {
            
            let displayed = false;
            for (let subject of subjects) {
            
                const subjectRect = await subject.getRect();
            
                // attempt to ignore border when computing intersection
                const padding = 4;
                subjectRect.x += padding;
                subjectRect.y += padding;
                subjectRect.width  -= 2 * padding;
                subjectRect.height -= 2 * padding;
            
                if (daysRects[day].intersectsWith(subjectRect)) {
                    displayed = true;
                    break;
                }
            
            }

            if (displayed && !expectedDays.includes(day)) {
                throw `Event "${label}" should not be displayed in day "${day}"`
            }

            if (!displayed && expectedDays.includes(day)) {
                throw `Event "${label}" should be displayed in day "${day}"`
            }
        }
        
    }
    
});

Then('the {string} event should be rendered with', async function (label, dataTable) {
    
    const subject = await findElementByCss(css_selectors['events'] + `:contains("${label}")`);
    
    const colors_mapping = {
        'rgba(255, 0, 0, 1)':     'red',
        'rgba(255, 255, 255, 1)': 'white',
        'rgba(255, 192, 203, 1)': 'pink',
        'rgba(0, 0, 0, 1)':       'black'
    }
    
    for (const [cssName, expected] of Object.entries(dataTable.rowsHash())) {
        
        let actual = await subject.getCssValue(cssName);
        actual = colors_mapping[actual] || rgbaToHexa(actual);
        
        if (actual !== expected) {
            throw `Css "${cssName}" should be "${expected}" for event ${label} (got "${actual}" instead)`;
        }
        
    }
    
});

Then('I should see the element {string} in {string} event', async function (elementSelector, eventName) {
    
     const subjects = await findElementsByCss(
        css_selectors['events'] + `:contains("${eventName}") ` + elementSelector
     );
     
     expect(subjects.length).toBeGreaterThan(0);
     
});

Then('I should not see the element {string} in {string} event', async function (elementSelector, eventName) {
    
     const subjects = await findElementsByCss(
        css_selectors['events'] + `:contains("${eventName}") ` + elementSelector
     );
     
     expect(subjects.length).toBe(0);
     
});

const rgbaToHexa = (str) => '#' + str.replace('rgba(', '').replace(', 1)', '')
    .split(',').map(s => parseInt(s.trim()).toString(16).padStart(2, '0'))
    .join('');
    
