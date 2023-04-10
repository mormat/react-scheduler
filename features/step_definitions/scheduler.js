const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

const { Rectangle } = require('../../include/utils/geom.js');

const { getSchedulerScripts } = require('./config');

const { driver, findElementByCss, findElementsByCss, getPageText } = require('./webdriver');

const base_url  = 'http://localhost:9000';

const css_selectors = {
    'view_buttons': '.mormat-scheduler-Scheduler-Header-ViewModeSelector label',
    'events':       '.mormat-scheduler-event'
};

async function openScheduler() {
    
    driver.get(base_url + '?action=test');
    
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
        css_selectors['view_buttons'] + ':has(input:checked)'
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

When('I move the {string} event to {string}', async function (caption, datetime) {
    
    const [date, time] = datetime.split(' ');
    
    const elements = {    
        'subject': css_selectors['events'] + `:contains("${caption}")`,
        'hour':    `[data-hour="${time}"]`,
        'day':     `[rowspan][data-datemin^="${date} "]`
    }
    
    const rects = {};
    for (const k in elements) {
        elements[k] = await findElementByCss(elements[k]);
        rects[k]    = await elements[k].getRect();
    }
    
    const actions = driver.actions({async: true});
    
    const offset = {
        x: Math.floor(rects['day'].x  - rects['subject'].x),
        y: Math.floor(rects['hour'].y - rects['subject'].y)
    }
        
    const draggable = elements['subject'];
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
        'day':     `[rowspan][data-datemin^="${day} "]`,
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
        width:  rects['day'].width + 1,
        height: rects['to'].y - rects['from'].y + 1,
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
    
    const headers = await findElementsByCss('.day_header');

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
        
        const selector = css_selectors['events'] + `:contains("${label}")`;
        const subjects = await findElementsByCss(selector);
        
        for (let day in daysRects) {
            
            let displayed = false;
            for (let subject of subjects) {
            
                const subjectRect = await subject.getRect();
            
                // attempt to ignore border when computing intersection
                subjectRect.x += 1;
                subjectRect.y += 1;
                subjectRect.width  -= 2;
                subjectRect.height -= 2;
            
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

