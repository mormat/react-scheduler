const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

const { Rectangle } = require('../../dist/utils/geom.js');

const { getSchedulerScripts } = require('./config');

const { driver, findElementByCss, findElementsByCss, getPageText } = require('./webdriver');

const { clickOn } = require('./webdriver');

const base_url  = 'http://localhost:9000';

const css_selectors = {
    'view_buttons': '.mormat-scheduler-Widget-ToggleButtonGroup button',
    'events':       '[class*="-Event"]'
};

async function openScheduler() {
    
    driver.get(base_url + '/test.html');
    
    const scripts = getSchedulerScripts();
    for (let script of scripts) {
        driver.executeScript(script + ';');
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


Then('the {string} event should be at {string} from {string} to {string}', async function (caption, day, from, to) {
    
    const elements = {
        'subject': css_selectors['events'] + `:contains("${caption}")`,
        'day':     `[rowspan][data-day="${day}"]`,
        'from':    `[data-hour="${from}"]`,
        'to':      `[data-hour="${to}"]` 
    }
    
    const rects = {};
    for (const k in elements) {
        elements[k] = await findElementByCss(elements[k]);
        rects[k]    = await elements[k].getRect();
    }
    
    const parentRect = new Rectangle({
        x:      rects['day'].x,
        y:      rects['from'].y,
        width:  rects['day'].width + 2,
        height: rects['to'].y - rects['from'].y + 2,
    });
    
    if (!parentRect.contains(rects['subject'])) {
        throw `"${caption}" event not displayed at "${day}" from "${from}" to "${to}"`;
    }
    
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
    
    const headers = await findElementsByCss('[data-day][data-role="header"]');

    const daysRects = {}
    for (const header of headers) {
        const day      = await header.getAttribute('data-day');
        const elements = await findElementsByCss(`td[data-day="${day}"]`);
        daysRects[day] = Rectangle.createBounding(
            await Promise.all(elements.map(r => r.getRect()))
        );
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
        'rgba(0, 0, 0, 1)':       'black',
        'rgba(2, 136, 209, 1)':   '#0288d1',
    }

    for (const [cssName, expected] of Object.entries(dataTable.rowsHash())) {
        
        let actual = await subject.getCssValue(cssName);
        actual = colors_mapping[actual] || actual;
        
        if (actual !== expected) {
            throw `Css "${cssName}" should be "${expected}" for event ${label} (got "${actual}" instead)`;
        }
        
    }
    
});

When('I click on {string} in {string} event', async function (text, eventLabel) {
    const root = css_selectors['events'] + `:contains("${eventLabel}")`;
    
    await clickOn(text, root);
});
