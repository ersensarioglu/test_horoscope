import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { CustomWorld } from './world';
import { Framework } from '../support/framework.functions';
import { Horoscope } from '../support/horoscope.functions';
import { Clicker } from '../support/clicker.functions';
import { Filler } from '../support/filler.functions';
import { getConfigValue } from '../support/helper.functions';

Before(async function (this: CustomWorld) {
    const headless = getConfigValue('HEADLESS')?.toLowerCase() !== 'false';
    const slowMo = Number(getConfigValue('SLOWMO')) || 0;
    // Optionally, you can add viewport config here if needed
    // const viewport = {
    //     width: Number(getConfigValue('VIEWPORT_WIDTH')) || 1280,
    //     height: Number(getConfigValue('VIEWPORT_HEIGHT')) || 720
    // };

    this.browser = await chromium.launch({ headless, slowMo });
    this.context = await this.browser.newContext(/* { viewport } */);
    this.page = await this.context.newPage();
    this.framework = new Framework(this.page, this.context);
    this.horoscope = new Horoscope(this.framework);
    this.clicker = new Clicker(this.framework);
    this.filler = new Filler(this.framework);
});

After(async function (this: CustomWorld) {
    await this.browser.close();
});
