import { test, expect, Page } from '@playwright/test';
import { userLogin, randomId } from '@utils/login';
import { config } from 'dotenv';

config();

test.describe.configure({ mode: 'serial' });

let page: Page;
let orgName: string;

test('it should create an organization', async ({ browser }) => {
	page = await userLogin(browser, 'A');
	await expect(page).toHaveURL('/my');

	await page.getByRole('link', { name: 'My organizations' }).click();
	await expect(page).toHaveURL('/my/organizations');

	await page.getByRole('link', { name: 'plus Create a new organization' }).click();
	await expect(page).toHaveURL('/my/organizations/create');

	orgName = `org-${randomId()}`;
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill(orgName);
	await page.getByRole('button', { name: 'Create organization' }).click();
	await expect(page).toHaveURL(new RegExp('/my/organizations/(.*)'));
	await expect(page.getByRole('heading', { name: orgName })).toBeVisible();
});

test('it should edit organization name', async () => {
	await page.getByRole('link', { name: 'General' }).click();
	await page.locator('input[name="name"]').click();

	orgName = `org-${randomId()}`;
	await page.locator('input[name="name"]').fill(orgName);
	await page.getByRole('button', { name: 'Save changes' }).click();
	await expect(page.getByRole('heading', { name: orgName })).toBeVisible();

	// await page.getByRole('button', { name: 'plus Add entry' }).click();
	// await page.locator('form div').filter({ hasText: 'Select' }).nth(3).click();
	// await page.getByPlaceholder('Select').fill('userC');
	// await page.getByText('userC | userC@example.org | p8zavjpobesyk44').click();
	// await page.locator('select[name="role"]').selectOption('csbo0gf4tnmn6xa');
	// await page.getByRole('button', { name: 'Create record' }).click();
});

test('it should add user B to the organization as admin', async () => {
	let username = 'userB';
	let email = `${username}@example.org`;
	let role = 'admin';
	await page.getByRole('link', { name: 'Members' }).click();
	await page.getByRole('button', { name: 'plus Add entry' }).click();
	await page.locator('form div').filter({ hasText: 'Select' }).nth(3).click();
	await page.getByPlaceholder('Select').fill(username);
	await page.getByText(email).click();
	await page.locator('select[name="role"]').selectOption({ label: role });
	await page.getByRole('button', { name: 'Create record' }).click();
	await expect(
		page
			.locator('tr')
			.filter({ has: page.getByText(email) })
			.filter({ has: page.getByText(role) })
	).toBeVisible();
});

test('it should add user C to the organization as member', async () => {
	let username = 'userC';
	let email = `${username}@example.org`;
	let role = 'member';
	await page.getByRole('button', { name: 'plus Add entry' }).click();
	await page.locator('form div').filter({ hasText: 'Select' }).nth(3).click();
	await page.getByPlaceholder('Select').fill(username);
	await page.getByText(email).click();
	await page.locator('select[name="role"]').selectOption({ label: role });
	await page.getByRole('button', { name: 'Create record' }).click();
	await expect(
		page
			.locator('tr')
			.filter({ has: page.getByText(email) })
			.filter({ has: page.getByText(role) })
	).toBeVisible();
});

test('it should fail to add A as member', async () => {
	let username = 'userA';
	let email = `${username}@example.org`;
	let role = 'member';
	await page.getByRole('button', { name: 'plus Add entry' }).click();
	await page.locator('form div').filter({ hasText: 'Select' }).nth(3).click();
	await page.getByPlaceholder('Select').fill(username);
	await page.getByRole('dialog').getByRole('document').getByText(email).click();
	await page.locator('select[name="role"]').selectOption({ label: role });
	await page.getByRole('button', { name: 'Create record' }).click();
	await expect(page.getByText('Failed to create record.')).toBeVisible();
});
