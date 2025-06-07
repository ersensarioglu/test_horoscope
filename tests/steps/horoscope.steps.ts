import { Given, Then } from '@cucumber/cucumber';
import type { CustomWorld } from './world';
import { getConfigValue } from '../support/helper.functions';

// --- Step Definitions ---

Given('I am on the horoscope website\'s main page', async function (this: CustomWorld) {
    const APP_URL = getConfigValue('APP_URL');
    await this.framework!.goto(APP_URL!);
});

Given('I have submitted my details and am on the horoscope page', { timeout: 60000 }, async function (this: CustomWorld) {
    const APP_URL = getConfigValue('APP_URL');
    const firstName = getConfigValue('FIRST_NAME');
    const surname = getConfigValue('SURNAME');
    const dob = getConfigValue('DOB');
    await this.framework!.goto(APP_URL!);
    await this.horoscope!.loginPage({
        firstName: firstName!,
        surname: surname!,
        dob: dob!
    });
});


Then('I should be taken to the horoscope selection page for {string}', async function (this: CustomWorld, name: string) {
    await this.horoscope!.expectSelectionPage(name);
});

Then('I should see 12 cards for each month of the year', async function (this: CustomWorld) {
    await this.horoscope!.validateAllCards();
});

Then('I should see my horoscope for {string}', async function (this: CustomWorld, month: string) {
    await this.horoscope!.viewSelected(this.newPagePromise, month);
});

Then('I should close the horoscope result', async function (this: CustomWorld) {
    await this.horoscope!.closeSelected(this.newPagePromise);
});
