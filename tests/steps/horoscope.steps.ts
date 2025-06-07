import { Given, Then } from '@cucumber/cucumber';
import type { CustomWorld } from './world';
import { Horoscope } from '../support/horoscope.functions';
import { getConfigValue } from '../support/helper.functions';
import { Framework } from '../support/framework.functions';

// --- Step Definitions ---

Given('I am on the horoscope website\'s main page', async function (this: CustomWorld) {
    const APP_URL = getConfigValue('APP_URL');
    // Create a temp Framework just to call openPage, or move openPage logic here:
    const context = await this.browser.newContext();
    const page = await context.newPage();
    await page.goto(APP_URL!);
    this.context = context;
    this.page = page;
    this.framework = new Framework(page, context);
});

Given('I have submitted my details and am on the horoscope page', { timeout: 60000 }, async function (this: CustomWorld) {
    const APP_URL = getConfigValue('APP_URL');
    const firstName = getConfigValue('FIRST_NAME');
    const surname = getConfigValue('SURNAME');
    const dob = getConfigValue('DOB');
    const framework = new Framework(this.page, this.context);
    const horoscope = new Horoscope(framework);
    await horoscope.gotoPage(APP_URL!);
    await horoscope.loginPage({
        firstName: firstName!,
        surname: surname!,
        dob: dob!
    });
});


Then('I should be taken to the horoscope selection page for {string}', async function (this: CustomWorld, name: string) {
    const framework = new Framework(this.page, this.context);
    const horoscope = new Horoscope(framework);
    await horoscope.expectSelectionPage(name);
});

Then('I should see 12 cards for each month of the year', async function (this: CustomWorld) {
    const framework = new Framework(this.page, this.context);
    const horoscope = new Horoscope(framework);
    await horoscope.validateAllCards();
});

Then('I should see my horoscope for {string}', async function (this: CustomWorld, month: string) {
    const framework = new Framework(this.page, this.context);
    const horoscope = new Horoscope(framework);
    await horoscope.viewSelected(this.newPagePromise, month);
});

Then('I should close the horoscope result', async function (this: CustomWorld) {
    const framework = new Framework(this.page, this.context);
    const horoscope = new Horoscope(framework);
    await horoscope.closeSelected(this.newPagePromise);
});
