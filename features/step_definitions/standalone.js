const { Given, When, Before, Then } = require('@cucumber/cucumber');
const { By, Select  } = require('selenium-webdriver');
const { driver, findElementByCss, findElementsByCss } = require('./webdriver');
const { JSDOM } = require("jsdom");
const { expect } = require('expect');
const { getPreScripts } = require('./config');

const { setFormValues }  = require('./forms');

const base_url  = 'http://localhost:9001';

When('I open the standalone version with the script below:', function (docString) {
    
    driver.get(base_url + '/standalone.html?action=test');    
    
    driver.executeScript(docString + ';');
    
});

When('I open the admin section', function () {
    
    driver.get(base_url + '/admin.html?action=test');
    
    for (const script of getPreScripts()) {
        driver.executeScript(script + ';');
    }
    
    driver.executeScript("mormat_standalone_scheduler.renderAdminSection('#main')");
    
});

When('I open the admin section with the props below:', function (dataTable) {

    driver.get(base_url + '/admin.html?action=test');
    
    const props = dataTable.raw().map(([v,k]) => v+': '+k).join(',')
    
    for (const script of getPreScripts()) {
        driver.executeScript(script + ';');
    }
    
    driver.executeScript(
        `mormat_standalone_scheduler.renderAdminSection('#main', {${props}})`
    );

});