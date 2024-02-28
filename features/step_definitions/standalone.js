
const { When } = require('@cucumber/cucumber');

const { driver } = require('./webdriver');

const base_url  = 'http://localhost:9001';

When('I open the standalone version with the script below:', function (docString) {
    driver.get(base_url + '/standalone.html?action=test');    
    driver.executeScript(docString + ';');
});