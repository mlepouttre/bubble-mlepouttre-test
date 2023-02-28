# bubble-mlepouttre-test

This repo contains [Playwright](https://playwright.dev/) tests for the
[mlepouttre-test](https://mlepouttre-test.bubbleapps.io/) bubble.io app. The app
is a Slack clone based on a [Bubble build guide](https://bubble.io/blog/build-no-code-slack-clone/).

## Dependencies

### npm

The project has 2 dependencies, [playwright](https://www.npmjs.com/package/@playwright/test) and [lorem-ipsum](https://www.npmjs.com/package/lorem-ipsum). You can
install them with npm.

    $ npm install 

### Browsers

Depending on your `npm` configuration, you may need to install Playwright's
browsers manually. The project is currently configured to only run tests against
Chrome so you will only need to install the Playwright Chromium browser.

    $ npx playwright install chromium

### Playwright Authentication

Playwright allows saving login credentials for re-use during test runs. This has
been implemented in [global-setup.ts](/global-setup.ts). Before you run tests
for the first time, you will need to create a credentials file at the location
specified by the `storageState` option in
[playwright.config.ts](/playwright.config.ts).

    $ mkdir -p playwright/.auth && touch playwright/.auth/user.json

## Running tests

Playwright tests can be run with `npx`:

    $ npx playwright test

This will run all tests located in the [tests](/tests) directory. Playwright
will create an HTML report in the [playwright-report](/playwright-report/)
directory that will open automatically if there any failures. Screenshots will
be saved in the [test-results](/test-results/) directory.
