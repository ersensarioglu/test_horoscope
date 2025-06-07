import { loc } from './static.functions';
import { Framework } from './framework.functions';

export class Clicker {
    constructor(private framework: Framework) {}

    async clickButton(buttonText: string) {
        await this.framework.click(loc.button(buttonText));
    }

    async clickMonthCard(month: string, world?: { newPagePromise?: Promise<any> }) {
        const selectors = [
            '.horoscope-content',
            '#horoscope-modal',
            'p#refresh-body',
            'p#expand-body',
            'p#modal-body'
        ];
        if (world && this.framework['context']) {
            world.newPagePromise = this.framework.waitForPageOrChange(selectors);
        }
        await this.framework.click(loc.monthCard(month));
    }
}
