# [0.2.0](https://github.com/aurelia/new/compare/v0.1.0...v0.2.0) (2020-04-16)


### Bug Fixes

* **app-min:** skip test on no-unit-tests ([85bc12a](https://github.com/aurelia/new/commit/85bc12adb00305a9fe1d56d42ac62a3af76e020d))
* **app-with-router:** set .goto-active as global css class when using css-module ([cd0375f](https://github.com/aurelia/new/commit/cd0375fa94a211b5661f06b943787cadb94eb533)), closes [aurelia/aurelia#828](https://github.com/aurelia/aurelia/issues/828)
* **dumber:** cleanup tests, fix css-module tests ([986cc26](https://github.com/aurelia/new/commit/986cc26251144207ac4fc8f9293f436745713b89))
* **tape:** fix tape version ([5eb122a](https://github.com/aurelia/new/commit/5eb122a4a46fabc2b183027202dcf64f30fea9f9))
* **tape:** fix typescript import ([a0d0fef](https://github.com/aurelia/new/commit/a0d0fef167ce0ce55949802c6c749829dacd8739))
* **test:** fix outdated test code for shadow-dom and css-modules ([f111b54](https://github.com/aurelia/new/commit/f111b54a0a20485c465152fa34a10384f92a5d1b))
* **test:** fix setup js/ts code ([5273d3f](https://github.com/aurelia/new/commit/5273d3f704042f84ac59ea4a31e9825801be4558))
* **test:** scheduler has been moved ([78770e2](https://github.com/aurelia/new/commit/78770e2b09790842130872808c15d36e7ad09098)), closes [aurelia/aurelia#831](https://github.com/aurelia/aurelia/issues/831)
* **typescript:** add missing module def for less and scss files ([9947f33](https://github.com/aurelia/new/commit/9947f339305302754eb4604dd007946e14613b75))
* **webpack:** allow shared style import in main file for setup with shadowDom ([fcc8a5c](https://github.com/aurelia/new/commit/fcc8a5cf0ccce1b5637990cf1106703766a569dc))
* **webpack:** bypass tsc for test setup ([b24d71f](https://github.com/aurelia/new/commit/b24d71f7b0d7f11824482b5e961657c65cbae046))
* **webpack:** cleanup duplicated loader ([5b2f88a](https://github.com/aurelia/new/commit/5b2f88aa2ee205a1ea94e7d4fe1c16d5e3f2bb89))
* **webpack:** fix css setup on resources ([4463813](https://github.com/aurelia/new/commit/446381399a708458ad726068e5f6c88955c91a10)), closes [#18](https://github.com/aurelia/new/issues/18)
* **webpack:** fix missing analyze ([b22389c](https://github.com/aurelia/new/commit/b22389c9abe07ca04079aa2c9ae4b3f66d794daa))
* **webpack:** fix shared shadow-dom styles ([cdd50fd](https://github.com/aurelia/new/commit/cdd50fd63415dcaa682eb0c7604f57eb341a3f1f))
* bypass style-loader when shadow-dom is in use ([160eb61](https://github.com/aurelia/new/commit/160eb61c149769db2fc238efea5dac194736fa08))
* CustomElement.behaviorFor has been changed to CustomElement.for ([bd2b16a](https://github.com/aurelia/new/commit/bd2b16a061e625df9bc8f1cd7aff658214a3dcc4))
* fix dumber gulp file ([071e5e3](https://github.com/aurelia/new/commit/071e5e3866d883c465b7109add2dddb63adfde9e))
* fix dumber gulpfile on test build ([f30163b](https://github.com/aurelia/new/commit/f30163b0038e9a9e90b819464ae8766fae932335))
* fix sass-lint version ([5466b50](https://github.com/aurelia/new/commit/5466b507393d5ce99d0c5293d8f0dd7e0d208fd0))
* fix sass-loader options ([1f030d1](https://github.com/aurelia/new/commit/1f030d12d529fd9802c5bd9dbb58725bc59b51e9))
* fix shadowRoot typing in TS ([b55a327](https://github.com/aurelia/new/commit/b55a3272003c24d1cecd2c5429f80455a5e4dbdb))
* fix sourcemap of dumber browser test ([61b7393](https://github.com/aurelia/new/commit/61b73936cca07fc5886f0f9e235ba394fc6b5794))
* fix tape usage on fs ([10c0dbd](https://github.com/aurelia/new/commit/10c0dbd3f0e3a214e9d4df5221430cf3d4f2f906))
* fix ts typing in unit tests ([1051588](https://github.com/aurelia/new/commit/10515889eba3dfbed429a589d9de7b1da0e181dc))
* fix tslint error ([07f52d2](https://github.com/aurelia/new/commit/07f52d2ebec6439e81e0466db3cd5bedee461409))
* fix webpack test setup ([9c63cbd](https://github.com/aurelia/new/commit/9c63cbd37fb307561dace21eb940deb33ad881c5))
* fix webpack watch mode unit test ([3bc28aa](https://github.com/aurelia/new/commit/3bc28aa23c49e62cbb32e0394133cd86be07b9e7))
* should reject error in test mode ([022b6bb](https://github.com/aurelia/new/commit/022b6bb460687ac2d6a296cc082fa314ef616247))
* should use absolute src path in webpack resolve.modules ([1e1f80a](https://github.com/aurelia/new/commit/1e1f80a26a2ea67ea7b2742cf602225a9716883e))
* use to-string-loader to support shadow-dom css ([28a8136](https://github.com/aurelia/new/commit/28a8136044c87088d3be2e7f6291a60f1676d127))
* **webpack:** missing path import in webpack config ([e23ebdc](https://github.com/aurelia/new/commit/e23ebdce916f0a4758008273be561191a9db3f46))


### Features

* use sass rather than node-sass ([#16](https://github.com/aurelia/new/issues/16)) ([51ffd74](https://github.com/aurelia/new/commit/51ffd747c80470ba12d0fcb8efd9493bea503c52))
* **all:** add option for app-with-router ([327f67d](https://github.com/aurelia/new/commit/327f67d536263306f2438fa7d5aea0e90a13d9c1))
* **test:** proper test setup ([a5896af](https://github.com/aurelia/new/commit/a5896afdfa2b63fe2ca7c126c3a4c25ae7fe9fbd)), closes [#11](https://github.com/aurelia/new/issues/11)
* **webpack:** support --analyze ([2b3a9a1](https://github.com/aurelia/new/commit/2b3a9a1331c7138a4bd73e8c7661c919f618fc3f))
* add options of less/sass ([8277f4e](https://github.com/aurelia/new/commit/8277f4e1b2b6d69398f558137adc02f6369a6daa))
* add sass/less linter ([1df677a](https://github.com/aurelia/new/commit/1df677a446eec5301f7cc6fb2828518349f72535))
* support dynamic import in babel ([97ada26](https://github.com/aurelia/new/commit/97ada261f44024044a705503c9e7e5fc374d0666))
* **webpack:** switch webpack config to use env string ([82bd63f](https://github.com/aurelia/new/commit/82bd63f93b024c1d774c930f6fe71fa0fd64490d))


### BREAKING CHANGES

* **webpack:** webpack env is now controlled by --env production or NODE_ENV.



# 0.1.0 (2019-10-02)


### Bug Fixes

* **dumber:** re-compile all files in watch mode ([e758e6b](https://github.com/aurelia/new/commit/e758e6b)), closes [aurelia/aurelia#605](https://github.com/aurelia/aurelia/issues/605)
* add css module typing for TS apps ([a2c8ded](https://github.com/aurelia/new/commit/a2c8ded))
* add delay to cypress test ([c63b9ff](https://github.com/aurelia/new/commit/c63b9ff))
* fix browserify+typescript issue ([4f2ee06](https://github.com/aurelia/new/commit/4f2ee06))
* fix template for shadowdom and cssmodule ([8ea0248](https://github.com/aurelia/new/commit/8ea0248))


### Features

* basic cypress e2e tests ([55d1d2b](https://github.com/aurelia/new/commit/55d1d2b))
* basic dumber ts/js apps ([09e6b83](https://github.com/aurelia/new/commit/09e6b83))
* basic FuseBox ts/js apps ([73cbadb](https://github.com/aurelia/new/commit/73cbadb))
* basic parcel ts/js apps ([9f3aa86](https://github.com/aurelia/new/commit/9f3aa86))
* basic webpack ts/js apps ([2dc0821](https://github.com/aurelia/new/commit/2dc0821))
* css-module and scoped css in shadow dom ([0ae52bb](https://github.com/aurelia/new/commit/0ae52bb))
* css-module in dumber ([097242e](https://github.com/aurelia/new/commit/097242e))
* only use ShadomDOM closed mode in production mode ([b656b55](https://github.com/aurelia/new/commit/b656b55))
* switch to latest simplified "aurelia" package ([7056629](https://github.com/aurelia/new/commit/7056629))
* use shadowOptions in bundler plugins. ([8f5ce5a](https://github.com/aurelia/new/commit/8f5ce5a))
* **dumber:** use @aurelia/plugin-gulp to support Aurelia conventions ([5e460f8](https://github.com/aurelia/new/commit/5e460f8))
* **webpack:** use @aurelia/webpack-loader to support Aurelia conventions ([6de403a](https://github.com/aurelia/new/commit/6de403a))




