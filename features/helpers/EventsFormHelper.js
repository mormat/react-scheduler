
class EventsFormHelper {
    
    constructor(world, events) {
        this._world = world;
        this._events = events;
    }
    
    async updateForm(values) {
        
        const world = this._world;
        
        for (const [name, value] of Object.entries(values)) {
            
            // 
            try {
                await world.clickOn(`//label/span[normalize-space()='${name}']`);
            } catch (err) {
                await world.clickOn(`label:contains("${name}")`);
            }
            const inputElement = await world.getActiveElement();
            await this.fillValue(inputElement, value);
        }
        
    }
    
    async confirmForm() {
        await this._world.clickOn(`.mormat-scheduler-btnConfirmEvent`);
    }
    
    async createEvent(values) {
        
        const world = this._world;
        
        await world.clickOn(`.mormat-scheduler-btnAddEvent`);
        
        await this.updateForm(values);
        
        await this.confirmForm();
        
    }
    
    async editEvent(eventName) {
        
        await this._events.clickEdit( eventName );
        
    }
    
    async updateEvent(eventName, values) {
        
        await this.editEvent(eventName);
        
        const world = this._world;
        
        await this.updateForm(values);
        
        await this.confirmForm();
        
    }
    
    async deleteEvent(eventName) {
        
        await this.editEvent(eventName);
        
        await this._world.clickOn(`.mormat-scheduler-btnDeleteEvent`);
        
        await this._world.clickOn(`.mormat-scheduler-btnConfirmDialog`);
        
    }
    
    async fillValue(inputElement, value) {
        const tagName = await inputElement.getTagName();
        const type  = await inputElement.getAttribute('type');
        const title = await inputElement.getAttribute('title');
        
        if (tagName === 'input' && type === 'datetime-local') {
            await inputElement.clear();
            await inputElement.sendKeys( value.replace(" ", "\t") );
            return;
        }
        
        if (tagName === 'select' && title === "time") {
            let selectElement = inputElement;
            const values = value.split(" ");
            for (const value of values) {
                const option = await this._world.getElement(
                    `option[title="${value}"]`,
                    selectElement
                );
                await option.click();
                
                await selectElement.sendKeys("\t");
                selectElement = await this._world.getActiveElement();
            }
            return;
        }
        
        await inputElement.clear();
        await inputElement.sendKeys(value);
    }
    
    async getFormValue(labelText, ) {
        
        const world = this._world;
        
        const label = await world.getElement(`label:contains("${labelText}")`);
        
        const fields = await world.findElements(
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
        
        return actualValues.join(' ');
    }
    
}

module.exports = EventsFormHelper;
