# Aurelia 2 scaffolding skeleton

![CI](https://github.com/aurelia/new/workflows/CI/badge.svg) ![E2E-Linux](https://github.com/aurelia/new/workflows/E2E-Linux/badge.svg) ![E2E-Windows](https://github.com/aurelia/new/workflows/E2E-Windows/badge.svg) ![E2E-macOS](https://github.com/aurelia/new/workflows/E2E-macOS/badge.svg)

The scaffolding repo for Aurelia 2 used by the [makes](https://makes.js.org) tool to create new Aurelia 2 projects.

## Create an Aurelia 2 project

First, ensure that you have Node.js v14 or above installed on your system. Next, using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b), a tool distributed as part of Node.js, we'll create a new Aurelia 2 app. At a command prompt, run the following command:

```bash
npx makes aurelia
```

This will cause `npx` to download the `makes` tool, along with the `aurelia` scaffold from this repo, which it will use to guide you through creating your project.

## Presets and samples

Use the preset picker to quickly choose a profile, including **Lean Modern Frontend** (TypeScript + Vite + Tailwind + Vitest + Storybook). When picking sample code, you can select **Blank app** for a clean, empty app shell (no demo markup) or use the minimal/router samples as before.

## Plugin projects (Vite + Webpack)

Plugin templates support Vite or Webpack. The Vite plugin build uses Vite's library mode (Rollup under the hood) and injects component CSS into the JS bundle so consumers don't need to import a separate CSS file. The dev-app still runs on the selected bundler for local testing.

## Development

There are some tests for this skeleton, setup in package.json. (totally not required by makes)

## Unit tests

Unit tests for various "makes" files.

```bash
npm test
```

## E2E Test

E2E tests for skeletons.

GitHub Actions runs a subset of them for every PR or push to master.

```bash
# Do not run following directly. There are too many skeletons.
npm run test:e2e
```

Always target a subset of skeletons, use env variable `TARGET_FEATURES`.

```bash
# only test skeletons using webpack and typescript features.
npx cross-env TARGET_FEATURES=webpack,typescript npm run test:e2e
```

## Local development

If you forked this repo, you can try your skeleton with:

```bash
# Try your master branch if your forked name is "new"
npx makes your_GitHub_name
# Try some branch or commit or tag
npx makes your_GitHub_name/forked_repo_name#some-branch
```

## License

MIT.
