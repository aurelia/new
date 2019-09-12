# Aurelia 2 Scaffolding skeleton

[![Build Status](https://travis-ci.com/aurelia/new.svg?branch=master)](https://travis-ci.com/aurelia/new)

_Work In Progress_

The scaffolding repo for Aurelia 2 used by the [makes](https://makes.js.org) tool to create new Aurelia 2 projects.

## Create an Aurelia 2 project

There is zero-installation, just do:

```bash
npx makes aurelia
```

> Note makes requires Node.js v8.9.0 or above.

## Status

- [x] Aurelia convention support (boilerplate free like Aurelia v1) at bundler level
- [x] Basic app with webpack
- [x] Basic app with dumber (successor of CLI built-in bundler. Doc WIP)
- [ ] Basic app with parcel (On hold)
  * Parcel can be done. But requires a dedicated repo (out of our mono repo) in order to write in commonjs format that Parcel wants.
  * https://github.com/parcel-bundler/parcel/issues/3256
  * Parcel v2 is also very near. Might wait for the new version.
- [ ] Basic app with browserify (On hold)
  * Browserify has technical obstacle on TypeScript (tsify) https://github.com/TypeStrong/tsify/issues/34#issuecomment-514425682
  * There is no problem on babelify. But we will hold browserify for now.
- [ ] Basic app with FuseBox (On hold)
  * FuseBox v4 is coming, and it's a total rewrite. Wait for it before implement.
- [ ] Basic unit test setup for jest, jasmine, mocha, tape, ava
- [x] Basic e2e test setup for cypress
- [ ] Basic e2e test setup for protractor

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

## License

MIT.
