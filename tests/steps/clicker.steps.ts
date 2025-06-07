import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';
import { Clicker } from '../support/clicker.functions';
import { Framework } from '../support/framework.functions';

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
    const framework = new Framework(this.page, this.context);
    const clicker = new Clicker(framework);
    await clicker.clickButton(buttonText);
});

When('I click on the card for {string}', async function (this: CustomWorld, month: string) {
    const framework = new Framework(this.page, this.context);
    const clicker = new Clicker(framework);
    await clicker.clickMonthCard(month, this);
});
