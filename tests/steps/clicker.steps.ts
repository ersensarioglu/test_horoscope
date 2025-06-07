import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
});

When('I click on the card for {string}', async function (this: CustomWorld, month: string) {
    this.newPagePromise = this.context.waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await this.page.click(`div.month-card[data-month="${month}"]`);
});
