
const { findElementByCss, findElementsByCss } = require('./webdriver');

const { Select, Key  } = require('selenium-webdriver');

class AbstractFormType {
    
    constructor(element) {
        this.element = element;
    }
    
    async setValue(value) {}
    
}

class DateTimePickerFormType extends AbstractFormType {
        
    async setValue(value) {
        const values   = value.split(' ');
        
        const elements = await findElementsByCss('select', this.element);
        const selects  = elements.map(e => new Select(e));
        
        for (let k in values) {
            await selects[k].selectByVisibleText(values[k]);
        }
    }
    
}

class ColorPickerFormType extends AbstractFormType {
    
    async setValue(value) {
        
        const element = await findElementByCss(
            `label[data-label="${value}"]`, 
            this.element
        );

        await element.click();
    }
    
}

class DefaultFormType extends AbstractFormType {
    
    async setValue(value) {
        
        const input = await findElementByCss('input', this.element);
        
        // clear previous value if any
        const oldValue = await input.getAttribute('value');
        await input.sendKeys(Key.BACK_SPACE.repeat(oldValue.length));
        
        await input.sendKeys(value);
    }
    
}

async function createFormType(element) {
    const formType = await element.getAttribute('data-form-type');
    
    switch (formType) {
        case 'DatePicker':
        case 'TimePicker':
        case 'DateTimePicker':
            return new DateTimePickerFormType(element);
        case 'ColorPicker':
            return new ColorPickerFormType(element);
        default:
            return new DefaultFormType(element);
    }
}

async function setFormValues (values, parent) 
{
    
    const formTypes = {}
    for (const label in values) {
        const element = await findElementByCss(`[data-label="${label}"]`, parent);
        
        formTypes[label] = await createFormType(element);
    }
    
    for (const label in values) {
        await formTypes[label].setValue(values[label]);
    }
}


module.exports = { createFormType, setFormValues }