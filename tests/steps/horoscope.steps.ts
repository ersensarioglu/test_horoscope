import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './world';

const APP_URL = 'http://127.0.0.1:5001';

// --- Step Definitions ---

Given('I am on the horoscope website\'s main page', async function (this: CustomWorld) {
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    await this.page.goto(APP_URL);
});

Given('I have submitted my details and am on the horoscope page', { timeout: 60000 }, async function (this: CustomWorld) {
    // This combines the steps from the first scenario for efficiency
    await this.page.goto(APP_URL);
    await this.page.fill('input[name="first_name"]', 'Jane');
    await this.page.fill('input[name="surname"]', 'Smith');
    await this.page.fill('input[type="date"]', '1995-05-15');
    await this.page.click('button[type="submit"]');
    await expect(this.page.locator('h1')).toContainText('Your Year Ahead, Jane');
});


Then('I should be taken to the horoscope selection page for {string}', async function (this: CustomWorld, name: string) {
    await expect(this.page.locator('h1')).toContainText(`Your Year Ahead, ${name}`);
});

Then('I should see 12 cards for each month of the year', async function (this: CustomWorld) {
    const monthCards = await this.page.locator('.month-card').count();
    expect(monthCards).toBe(12);
});

Then('I should see my horoscope for {string}', async function (this: CustomWorld, month: string) {
    const expectedHoroscopeText = `Your horoscope for ${month} is`;

    // Try to get the new page if it was opened
    let newPage: any = null;
    if (this.newPagePromise) {
        newPage = await this.newPagePromise;
    }

    if (newPage) {
        await newPage.waitForLoadState();
        // Wait for either newtab-body or newwindow-body
        const found = await Promise.race([
            newPage.waitForSelector(`p#newtab-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(() => 'new-tab').catch(() => null),
            newPage.waitForSelector(`p#newwindow-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(() => 'new-window').catch(() => null)
        ]);
        expect(!!found).toBe(true);
        console.log(`[Race] ${found} shown for month: ${month}`);
        await newPage.close();
        return;
    }

    // If no new page, check the other options
    const race = Promise.race([
        this.page.waitForSelector(`p#expand-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'expanded-card', res })),
        this.page.waitForSelector(`p#refresh-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'page-refresh', res })),
        this.page.waitForSelector(`p#modal-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'popup-modal', res }))
    ]);

    try {
        const result = await race;
        console.log(`[Race] ${result.type} shown for month: ${month}`);
        expect(result.res).not.toBeNull();
    } catch (error) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error);
        }
        throw new Error(`Horoscope for ${month} was not displayed in any of the expected ways. Error: ${message}`);
    }
});

Then('I should close the horoscope result', async function (this: CustomWorld) {
    // 1. Expanded card: close by clicking the card again if visible
    if (await this.page.locator('p#expand-body').isVisible()) {
        // Find the parent card and click it again
        const card = await this.page.locator('p#expand-body').locator('..').locator('..');
        await card.click();
        return;
    }

    // 2. Modal: close by clicking the close button if visible
    if (await this.page.locator('#close-modal').isVisible()) {
        await this.page.click('#close-modal');
        return;
    }

    // 3. Refresh: close by clicking the back link if visible
    if (await this.page.locator('a[href="/horoscope"]').isVisible()) {
        await this.page.click('a[href="/horoscope"]');
        return;
    }

    // 4. New tab or window: close by clicking the close button in the new page
    if (this.newPagePromise) {
        const newPage = await this.newPagePromise;
        if (newPage && (await newPage.isClosed()) === false) {
            if (await newPage.locator('button[onclick="window.close()"]').isVisible()) {
                await newPage.click('button[onclick="window.close()"]');
            } else {
                await newPage.close();
            }
        }
        return;
    }

    throw new Error('Could not determine how to close the horoscope result.');
});
