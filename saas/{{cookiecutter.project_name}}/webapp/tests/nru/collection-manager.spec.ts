import { test, expect, type Page } from '@playwright/test';
import { userLogin } from '@utils/login';
import { config } from 'dotenv';

config();

test.describe('it should test the collection manager', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		const context = await browser.newContext();
		page = await context.newPage();
		await page.goto('/my');
	});

	test.afterAll(async ({ browser }) => {
		await browser.close();
	});

	test('userA should login and visit the collection manager page', async ({ browser }) => {
		page = await userLogin(browser, 'A');
		await page.goto('/tests/collection-manager');
		await page.getByRole('button', { name: 'Create record' }).click();
		await page.getByPlaceholder('abc').fill('name');
		await page.getByLabel('Number_field *').click();
		await page.getByLabel('Number_field *').press('ArrowUp');
		await page.getByLabel('Number_field *').press('ArrowUp');
		await page.getByLabel('Number_field *').press('ArrowUp');
		await page.getByLabel('Richtext_field *').click();
		await page.getByLabel('Richtext_field *').fill('ok');

		const fileChooserPromise = page.waitForEvent('filechooser');
		await page.getByLabel('File_field *').click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles({
			name: 'asd.txt',
			mimeType: 'text/plain',
			buffer: Buffer.from('Hello World')
		});

		await page.locator('button[name="relation_multi_field"]').click();
		await page.getByRole('combobox').first().click();
		// await page.locator('#c_woa').click();
		// await page.getByRole('option', { name: 'userA' }).click();
		// await page.getByLabel('Create record').getByRole('button', { name: 'Create record' }).click();
		// await page.getByLabel('Number_field *').press('ArrowUp');
		// await page
		// 	.getByLabel('Create record')
		// 	.locator('div')
		// 	.filter({ hasText: 'Create record' })
		// 	.nth(3)
		// 	.click();
	});
});
