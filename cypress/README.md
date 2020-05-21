## Cypress e2e test

All e2e tests are in `cypress/integration/`.

Run e2e tests with:

    npm run test:e2e

Note the `test:e2e` script uses start-server-and-test to boot up dev server on port 9000 first, then run cypress test, it will automatically shutdown the dev server after test was finished.

To run Cypress interactively, do

```bash
# Start the dev server in one terminal
npm start
# Start Cypress in another terminal
npx cypress open
```

For more information, visit https://www.cypress.io
