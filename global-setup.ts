import { chromium, FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {

  // read the config
  const { baseURL, storageState } = config.projects[0].use;

  // instantiate
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // navigate to app
  await page.goto(baseURL!);

  // fill in login popup
  await page.getByRole('button', {name: 'login'}).click();
  await page.getByPlaceholder('Email').fill('lisa.simpson@example.com');
  await page.getByPlaceholder('Password').fill('Test123!');
  await page.getByRole('button', {name: 'submit'}).click()

  // persist the authentication state
  await page.context().storageState({ path: storageState as string });

  // close the browser
  await browser.close();

}
