import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch({ headless: false });
});

After(async function (this: CustomWorld) {
    await this.browser.close();
});
