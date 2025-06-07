import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import type { Browser, Page, BrowserContext } from '@playwright/test';

export interface CustomWorld extends CucumberWorld {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    newPagePromise?: Promise<Page | null>;
}

class WorldImpl extends CucumberWorld implements CustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    newPagePromise?: Promise<Page | null>;
}

setWorldConstructor(WorldImpl);
