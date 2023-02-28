// @ts-check

import { LoremIpsum } from 'lorem-ipsum';
import { test, expect, request, APIRequestContext } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/home');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('NekoChat | Home');
});

test.describe('chat interaction', () => {
  let lorem: LoremIpsum;
  let requestContext: APIRequestContext;
  let token: any;

  test.beforeAll(async () => {

    // instantiate LoremIpsum object
    lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      }
    });

    // instantiate new request context so we don't interfere with the current
    // browser context
    requestContext = await request.newContext({
      baseURL: 'https://mlepouttre-test.bubbleapps.io'
    });

    // get token for API requests
    const newLogin = await requestContext.post('/api/1.1/wf/generate-user-token', {
      data: {
        email: 'homer.simpson@example.com',
        password: 'Test123!'
      }
    });
    expect(newLogin.ok()).toBeTruthy();
    const responseBody = await newLogin.json();
    token = responseBody.response.token;
  });

  test('can respond to new message in channel', async ({ page }) => {

    // navigate to the home page and click on the required channel
    await page.goto('/home');
    await page.getByText('Springfield Nuclear Power Plant').click();

    // send a message as a different user and verify it shows up
    const receivedMessage = lorem.generateSentences(1);
    console.log(`receivedMessage: ${receivedMessage}`);
    const newMessage = await requestContext.post('/api/1.1/wf/send-message', {
      headers: {
        'Authorization': `token ${token}`,
      },
      data: {
        channel: 'Springfield Nuclear Power Plant',
        message: receivedMessage,
      }
    });
    expect(newMessage.ok()).toBeTruthy();
    await expect(page.getByText(receivedMessage)).toBeVisible();

    // send a message as the logged in user via the UI and verify it shows up
    const sentMessage = lorem.generateSentences(1);
    console.log(`sentMessage: ${sentMessage}`);
    await page.locator('id=new-message').fill(sentMessage);
    await page.getByRole('button', {name: 'Send'}).click()
    await expect(page.getByText(sentMessage)).toBeVisible();
  });
});
