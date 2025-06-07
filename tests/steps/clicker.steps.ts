import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';

// Use the already-initialized Clicker from World
When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
    await this.clicker!.clickButton(buttonText);
});

When('I click on the card for {string}', async function (this: CustomWorld, month: string) {
    await this.clicker!.clickMonthCard(month, this);
});
