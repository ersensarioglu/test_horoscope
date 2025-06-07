import { Clicker } from './clicker.functions';
import { Filler } from './filler.functions';
import { loc } from './static.functions';
import { Framework } from './framework.functions';

export class Horoscope {
    constructor(private framework: Framework) {}

    async expectSelectionPage(name: string) {
        await this.framework.waitForVisible(loc.h1());
        const text = await this.framework.textContent(loc.h1());
        this.framework.assertContains(text, `Your Year Ahead, ${name}`);
    }

    async loginPage(details: { firstName: string; surname: string; dob: string }) {
        const filler = new Filler(this.framework);
        const clicker = new Clicker(this.framework);

        await filler.fillField('First Name', details.firstName);
        await filler.fillField('Surname', details.surname);
        await filler.fillDateOfBirth(details.dob);
        await clicker.clickButton('Submit');
        const text = await this.framework.textContent(loc.h1());
        this.framework.assertContains(text, `Your Year Ahead, ${details.firstName}`);
    }

    async validateAllCards() {
        const count = await this.framework.count(loc.monthCards());
        this.framework.assertEquals(count, 12);
    }

    async viewSelected(newPagePromise: Promise<any> | undefined, month: string) {
        const expectedHoroscopeText = `Your horoscope for ${month} is`;

        let newPage: any = null;
        if (newPagePromise) {
            newPage = await newPagePromise;
        }

        if (newPage) {
            await newPage.waitForLoadState?.();
            const found = await Promise.race([
                newPage.waitForSelector(loc.newTabBody(expectedHoroscopeText), { state: 'visible', timeout: 2000 }).then(() => 'new-tab').catch(() => null),
                newPage.waitForSelector(loc.newWindowBody(expectedHoroscopeText), { state: 'visible', timeout: 2000 }).then(() => 'new-window').catch(() => null)
            ]);
            this.framework.assertTrue(!!found, `[Race] ${found} shown for month: ${month}`);
            console.log(`[Race] ${found} shown for month: ${month}`);
            await newPage.close?.();
            return;
        }

        const race = Promise.race([
            this.framework.waitForVisible(loc.expandBody(expectedHoroscopeText), 2000).then(res => ({ type: 'expanded-card', res })),
            this.framework.waitForVisible(loc.refreshBody(expectedHoroscopeText), 2000).then(res => ({ type: 'page-refresh', res })),
            this.framework.waitForVisible(loc.modalBody(expectedHoroscopeText), 2000).then(res => ({ type: 'popup-modal', res }))
        ]);

        try {
            const result = await race;
            console.log(`[Race] ${result.type} shown for month: ${month}`);
            this.framework.assertNotNull(result.res);
        } catch (error) {
            let message = '';
            if (error instanceof Error) {
                message = error.message;
            } else {
                message = String(error);
            }
            throw new Error(`Horoscope for ${month} was not displayed in any of the expected ways. Error: ${message}`);
        }
    }

    async closeSelected(newPagePromise: Promise<any> | undefined) {
        if (await this.framework.isVisible(loc.expandBody())) {
            let card = this.framework.page.locator(loc.expandBody()).locator(loc.parent()).locator(loc.parent());
            await card.click();
            return;
        }
        if (await this.framework.isVisible(loc.closeModal())) {
            await this.framework.click(loc.closeModal());
            return;
        }
        if (await this.framework.isVisible(loc.backLink())) {
            await this.framework.click(loc.backLink());
            return;
        }
        if (newPagePromise) {
            const newPage = await newPagePromise;
            if (newPage && (await newPage.isClosed?.()) === false) {
                if (await newPage.locator(loc.closeWindowButton()).isVisible()) {
                    await newPage.click(loc.closeWindowButton());
                } else {
                    await newPage.close?.();
                }
            }
            return;
        }
        throw new Error('Could not determine how to close the horoscope result.');
    }

    async gotoPage(url: string) {
        await this.framework.goto(url);
    }
}
