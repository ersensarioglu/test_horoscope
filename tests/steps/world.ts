import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import type { Browser, Page, BrowserContext } from '@playwright/test';
import type { Framework } from '../support/framework.functions';

export interface CustomWorld extends CucumberWorld {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    newPagePromise?: Promise<Page | null>;
    framework?: Framework;
}

class WorldImpl extends CucumberWorld implements CustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    newPagePromise?: Promise<Page | null>;
    framework?: Framework;
}

setWorldConstructor(WorldImpl);
