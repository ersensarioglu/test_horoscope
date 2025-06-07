import { loc } from './static.functions';
import { Framework } from './framework.functions';

export class Filler {
    constructor(private framework: Framework) {}

    async fillField(fieldName: string, value: string) {
        await this.framework.fill(loc.inputPlaceholder(fieldName), value);
    }

    async fillDateOfBirth(date: string = '1990-01-01') {
        await this.framework.fill(loc.inputDate(), date);
    }
}
