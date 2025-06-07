import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';

When('I fill in {string} for {string}', async function (this: CustomWorld, value: string, fieldName: string) {
    await this.page.fill(`input[placeholder="${fieldName}"]`, value);
});

When('I enter a valid date of birth', async function (this: CustomWorld) {
    await this.page.fill('input[type="date"]', '1990-01-01');
});
