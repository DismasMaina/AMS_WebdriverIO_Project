<!-- Copilot / AI agent instructions for WebdriverIO_Project -->

# Quick agent guide — AMS_WebdriverIO_Project

This repo contains WebdriverIO E2E tests using Mocha and the Allure reporter. Keep instructions short and actionable: focus on how tests run, where artifacts live, and common patterns you will modify.

-- **Entry points**: tests live under `test/specs/**/*.js`. Key config is [wdio.conf.js](../wdio.conf.js) which sets framework `mocha`, reporter `allure`, and Chrome as the capability.

- **Run tests**: use the npm script or wdio directly:
  - `npm run wdio` (runs `wdio run ./wdio.conf.js`)
  - Or: `npx wdio run ./wdio.conf.js --spec ./test/specs/login.spec.js`

- **Allure / artifacts**:
  - Allure results are written to `allure-results/` (see reporter config in [wdio.conf.js](../wdio.conf.js)).
  - Generated report lives under `allure-report/` (committed here for convenience).

- **Important behaviors to preserve**:
  - `afterTest` hook (in [wdio.conf.js](../wdio.conf.js)) takes a screenshot on failures. When modifying hooks, preserve this behavior.
  - Mocha options: BDD (`ui: 'bdd'`) and `timeout: 60000` are expected by existing specs.

- **Conventions & patterns observed**:
  - Tests use WebdriverIO `browser` global and standard `describe`/`it` Mocha flows.
  - Specs assume synchronous-looking async usage via WebdriverIO commands (do not wrap common `browser` calls in non-async wrappers unless necessary).
  - Test files follow simple, per-UI-flow naming (e.g., `login.spec.js` for auth flows).

- **Dev tooling**:
  - Formatting: `npm run format` (Prettier) — follow existing code style.
  - Check formatting: `npm run format:check`.

- **When editing tests or config, check**:
  - [wdio.conf.js](../wdio.conf.js) for `specs`, `reporters`, `capabilities`, `mochaOpts`, and hooks.
  - `package.json` scripts for `wdio` and formatting tasks.

- **Common tasks with exact commands**:
  - Run all specs: `npm run wdio`
  - Run a single spec: `npx wdio run ./wdio.conf.js --spec ./test/specs/<your-spec>.js`
  - View Allure report (generate locally): `allure generate allure-results -o allure-report --clean` then open `allure-report/index.html`.

- **Integration points / external deps**:
  - Dev dependencies: `@wdio/cli`, `@wdio/local-runner`, `@wdio/mocha-framework`, `@wdio/spec-reporter`, `@wdio/allure-reporter`, and `allure-commandline` (see `package.json`).
  - Tests expect a local Chrome driver; capabilities default to `chrome` in config.

- **What to avoid / not assume**:
  - Do not assume CI or cloud runners — this config is local-runner focused.
  - Do not change `allure-results` path unless also updating reporter config and CI steps.

- **Examples to reference when generating code or tests**:
  - A basic spec: `test/specs/login.spec.js`
  - Config hooks & reporters: `wdio.conf.js`

If anything in this short guide is unclear or you want more detail (CI, branching, or specific test patterns), tell me which area to expand.
