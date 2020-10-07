# Aurelia 2 scaffolding skeleton

![CI](https://github.com/aurelia/new/workflows/CI/badge.svg) ![E2E-Linux](https://github.com/aurelia/new/workflows/E2E-Linux/badge.svg) ![E2E-Windows](https://github.com/aurelia/new/workflows/E2E-Windows/badge.svg) ![E2E-macOS](https://github.com/aurelia/new/workflows/E2E-macOS/badge.svg)

The scaffolding repo for Aurelia 2 used by the [makes](https://makes.js.org) tool to create new Aurelia 2 projects.

## Create an Aurelia 2 project

First, ensure that you have Node.js v10 or above installed on your system. Next, using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b), a tool distributed as part of Node.js, we'll create a new Aurelia 2 app. At a command prompt, run the following command:

```bash
npx makes aurelia
```

This will cause `npx` to download the `makes` tool, along with the `aurelia` scaffold from this repo, which it will use to guide you through creating your project.

## Status

- [x] Aurelia convention support (boilerplate free like Aurelia v1) at bundler level
- [x] Basic app with webpack
- [x] Basic app with dumber (successor of CLI built-in bundler. Doc WIP)
- [ ] Basic app with parcel (On hold)
  * Parcel v2 is also very near. Might wait for the new version.
- [ ] Basic app with FuseBox (On hold)
  * FuseBox v4 is coming, and it's a total rewrite. Wait for it before implement.
- [x] Basic less/scss setup.
- [x] Basic unit test setup for jest, jasmine, mocha, tape. (ava is on hold, pending implementing transformer.)
- [x] Basic e2e test setup for cypress

## Development

This scaffolding skeleton is in the early stage, not quite ready for adding features. We want to keep feature set manageable as Aurelia 2 is constantly evolving.

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
