const { 
    Given, 
    When, 
    Then, 
    Before,
    setDefaultTimeout,
    setWorldConstructor
} = require('@cucumber/cucumber');

const { SeleniumWorld } = require('@mormat/test-utils');

const helpers = require('@mormat/jscheduler_ui/features/helpers');

const EventsFormHelper = require('../helpers/EventsFormHelper');

setDefaultTimeout( 60 * 1000 );

setWorldConstructor(class extends SeleniumWorld {
    
    constructor() {
        super({});
        
        const helpersInstances = helpers.buildInstances(this);
        
        const helperInstances = {
            ...helpersInstances,
            eventsForm: new EventsFormHelper(this, helpersInstances['events'])
        };
        
        return this.withDynamicGetters(helperInstances);
    }
    
    // @todo move to common lib
    async clickOn(selector, ...vars) {
        const element = await this.getElement(selector, ...vars);
        await element.click();
    }
    
    // @todo move to common lib
    withDynamicGetters(getters) {
        return new Proxy(this, {
            get: function(self, field) {
                if (field in self) return self[field]; // normal case
                return getters[field];
            }
        });
    }
    
});

Before(async function() {
    
    this.driver.manage().window().setRect({width: 1200, height: 1024});
    
});
