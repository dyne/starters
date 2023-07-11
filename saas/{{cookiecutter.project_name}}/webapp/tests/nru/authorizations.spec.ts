import { expect, test, type Browser } from '@playwright/test';
import { login } from '@utils/login';
import { config } from 'dotenv';

config();

async function userRoutine(browser: Browser, index: string, shouldBeAuthorized: boolean) {
	const email = process.env[`TEST_USER_${index}_MAIL`];
	const password = process.env[`TEST_USER_${index}_PASS`];

	if (!email || !password) throw new Error(`No test user ${index} email or password set in ENV`);

	const context = await browser.newContext();
	const page = await context.newPage();

	await login(page, email, password);
	await page.goto('/tests/authorizations');
	const protectedItem = page.locator('#protected');

	if (shouldBeAuthorized) {
		await expect(protectedItem).toBeVisible();
	} else {
		await expect(protectedItem).toBeHidden();
	}
}

// reference: saas/{{cookiecutter.project_name}}/admin/pb_migrations/seed_test_data.js
test('check authorizations', async ({ browser }) => {
	/* Owner context */
	await userRoutine(browser, 'A', true);

	/* Authorized context */
	await userRoutine(browser, 'B', true);

	/* Not authorized context */
	await userRoutine(browser, 'C', false);
});
