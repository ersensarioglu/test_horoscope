import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import type { Browser, Page, BrowserContext } from '@playwright/test';
import type { Framework } from '../support/framework.functions';
import type { Horoscope } from '../support/horoscope.functions';
import type { Clicker } from '../support/clicker.functions';
import type { Filler } from '../support/filler.functions';

export interface CustomWorld extends CucumberWorld {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    newPagePromise?: Promise<Page | null>;
    framework?: Framework;
    horoscope?: Horoscope;
    clicker?: Clicker;
    filler?: Filler;
}

class WorldImpl extends CucumberWorld implements CustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    newPagePromise?: Promise<Page | null>;
    framework?: Framework;
    horoscope?: Horoscope;
    clicker?: Clicker;
    filler?: Filler;
}

setWorldConstructor(WorldImpl);
