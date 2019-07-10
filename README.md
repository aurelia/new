# Aurelia 2 Scaffolding skeleton

[![Build Status](https://travis-ci.org/aurelia/new.svg?branch=master)](https://travis-ci.org/aurelia/new)

_Work In Progress_

The scaffolding repo for Aurelia 2 used by the [makes](https://makes.js.org) tool to create new Aurelia 2 projects.

## Create an Aurelia 2 project

There is zero-installation, just do:

```bash
npx makes aureila
```

> Note makes requires Node.js v8.9.0 or above.

## Status

- [x] Basic app with webpack
- [x] Basic app with parcel
- [x] Basic app with browserify (currently hidden because of https://github.com/aurelia/aurelia/pull/513)
- [x] Basic app with FuseBox
- [x] Basic app with dumber (successor of CLI built-in bundler. Doc WIP)
- [ ] Basic unit test setup for jest, jasmine, mocha, tape, ava
- [ ] Basic e2e test setup for cypress, protractor
- [ ] Aurelia convention support (boilerplate free like Aurelia v1) at bundler level

## Development

This scaffolding skeleton is in very early stage, not quite ready for adding features. We want to keep feature set manageable as Aurelia 2 is constantly evolving.

There are some tests for this skeleton, setup in package.json. (totally not required by makes)

```bash
npm install
# test some top level makes hooks
npm test
# test all skeletons, take some time, not turned on in .travis.yml
npm run test:e2e
```
