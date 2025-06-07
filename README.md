# test_horoscope

## Overview

`test_horoscope` is an automated end-to-end testing suite for a horoscope web application. It uses [Cucumber](https://cucumber.io/) for behavior-driven development (BDD) and [Playwright](https://playwright.dev/) for browser automation. The tests simulate user interactions such as submitting personal details, viewing monthly horoscopes, and verifying the application's UI and functionality.

## Features

- Automated testing of user flows for a horoscope website
- Step definitions written in TypeScript using Cucumber
- Page interaction and assertions via Playwright
- Scenarios include:
  - Submitting user details and verifying navigation
  - Viewing horoscopes for each month
  - Ensuring correct number of horoscope cards are displayed
  - Closing horoscope results in various UI forms (modal, new tab, etc.)

## Project Structure

- `tests/features/`: Gherkin feature files describing user scenarios
- `tests/steps/`: Step definitions implementing the feature steps
- `tests/support/`: Helper classes and functions for browser automation and assertions

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Set up configuration values such as `APP_URL`, `FIRST_NAME`, `SURNAME`, and `DOB` as required by the tests.

3. **Run the tests:**
   ```bash
   npx cucumber-js
   ```

## Customization

- Update the feature files in `tests/features/` to add or modify scenarios.
- Extend or modify helper functions in `tests/support/` for additional automation needs.

## License

MIT License