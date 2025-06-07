import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect, BrowserContext } from '@playwright/test';

let browser: Browser;
let page: Page;
let context: BrowserContext;

const APP_URL = 'http://127.0.0.1:5001';

// Launch the browser once before all tests
Before(async () => {
    browser = await chromium.launch({ headless: false, slowMo: 1000 });
});

// Close the browser after all tests
After(async () => {
    await browser.close();
});

// --- Step Definitions ---

Given('I am on the horoscope website\'s main page', async function () {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(APP_URL);
});

Given('I have submitted my details and am on the horoscope page', { timeout: 60000 }, async function () {
    // This combines the steps from the first scenario for efficiency
    await page.goto(APP_URL);
    await page.fill('input[name="first_name"]', 'Jane');
    await page.fill('input[name="surname"]', 'Smith');
    await page.fill('input[type="date"]', '1995-05-15');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toContainText('Your Year Ahead, Jane');
});


When('I fill in {string} for {string}', async function (value: string, fieldName: string) {
    // Using a more robust selector based on placeholder text
    await page.fill(`input[placeholder="${fieldName}"]`, value);
});

When('I enter a valid date of birth', async function () {
    await page.fill('input[type="date"]', '1990-01-01');
});

When('I click the {string} button', async function (buttonText: string) {
    await page.click(`button:has-text("${buttonText}")`);
});

When('I click on the card for {string}', async function (month: string) {
    // Listen for a new page before clicking
    this.newPagePromise = context.waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await page.click(`div.month-card[data-month="${month}"]`);
});


Then('I should be taken to the horoscope selection page for {string}', async function (name: string) {
    await expect(page.locator('h1')).toContainText(`Your Year Ahead, ${name}`);
});

Then('I should see 12 cards for each month of the year', async function () {
    const monthCards = await page.locator('.month-card').count();
    expect(monthCards).toBe(12);
});

Then('I should see my horoscope for {string}', async function (month: string) {
    const expectedHoroscopeText = `Your horoscope for ${month} is`;

    // Try to get the new page if it was opened
    let newPage: Page | null = null;
    if (this.newPagePromise) {
        newPage = await this.newPagePromise;
    }

    if (newPage) {
        await newPage.waitForLoadState();
        // Wait for either newtab-body or newwindow-body
        const found = await Promise.race([
            newPage.waitForSelector(`p#newtab-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(() => true).catch(() => false),
            newPage.waitForSelector(`p#newwindow-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(() => true).catch(() => false)
        ]);
        expect(found).toBe(true);
        await newPage.close();
        return;
    }

    // If no new page, check the other options
    const race = Promise.race([
        page.waitForSelector(`p#expand-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'expanded-card', res })),
        page.waitForSelector(`p#refresh-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'page-refresh', res })),
        page.waitForSelector(`p#modal-body:has-text("${expectedHoroscopeText}")`, { state: 'visible', timeout: 2000 }).then(res => ({ type: 'popup-modal', res }))
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
