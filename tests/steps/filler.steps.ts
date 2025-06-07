import { When } from '@cucumber/cucumber';
import type { CustomWorld } from './world';
import { Filler } from '../support/filler.functions';
import { Framework } from '../support/framework.functions';

When('I fill in {string} for {string}', async function (this: CustomWorld, value: string, fieldName: string) {
    const framework = new Framework(this.page, this.context);
    const filler = new Filler(framework);
    await filler.fillField(fieldName, value);
});

When('I enter a valid date of birth', async function (this: CustomWorld) {
    const framework = new Framework(this.page, this.context);
    const filler = new Filler(framework);
    await filler.fillDateOfBirth();
});
