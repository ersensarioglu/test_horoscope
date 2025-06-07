import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';

// Use the already-initialized Filler from World
When('I fill in {string} for {string}', async function (this: CustomWorld, value: string, fieldName: string) {
    await this.filler!.fillField(fieldName, value);
});

When('I enter a valid date of birth', async function (this: CustomWorld) {
    await this.filler!.fillDateOfBirth();
});
