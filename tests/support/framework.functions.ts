import { Page, BrowserContext } from '@playwright/test';

export class Framework {
    constructor(public page: Page, public context?: BrowserContext) {}

    async click(selector: string) {
        await this.page.click(selector);
    }

    async fill(selector: string, value: string) {
        await this.page.fill(selector, value);
    }

    async goto(url: string) {
        await this.page.goto(url);
    }

    async waitForVisible(selector: string, timeout = 3000) {
        return this.page.waitForSelector(selector, { state: 'visible', timeout });
    }

    async isVisible(selector: string) {
        return this.page.locator(selector).isVisible();
    }

    async textContent(selector: string) {
        return this.page.locator(selector).textContent();
    }

    async count(selector: string) {
        return this.page.locator(selector).count();
    }

    async waitForPageOrChange(selector: string): Promise<Page | null> {
        if (!this.context) throw new Error('Context is required for waitForPageOrChange');
        const result = await Promise.race([
            this.context.waitForEvent('page', { timeout: 3000 }).catch(() => null),
            this.page.waitForSelector(selector, { timeout: 3000 }).catch(() => null)
        ]);
        if (result && typeof result === 'object' && 'addInitScript' in result) {
            return result as Page;
        }
        return null;
    }

    assertContains(actual: string | null | undefined, expected: string) {
        if (!actual || !actual.includes(expected)) {
            throw new Error(`Expected "${actual}" to contain "${expected}"`);
        }
    }

    assertEquals(actual: any, expected: any) {
        if (actual !== expected) {
            throw new Error(`Expected "${actual}" to equal "${expected}"`);
        }
    }

    assertTrue(value: any, message?: string) {
        if (!value) {
            throw new Error(message || `Expected value to be truthy, got: ${value}`);
        }
    }

    assertNotNull(value: any) {
        if (value == null) {
            throw new Error('Expected value to be not null or undefined');
        }
    }
}
