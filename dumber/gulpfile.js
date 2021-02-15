const gulp = require('gulp');
const dumber = require('gulp-dumber');
const au2 = require('@aurelia/plugin-gulp').default;
const fs = require('fs');
// @if babel
const babel = require('gulp-babel');
// @endif
// @if typescript
const typescript = require('gulp-typescript');
// @endif
const plumber = require('gulp-plumber');
const merge2 = require('merge2');
const terser = require('gulp-terser');
const gulpif = require('gulp-if');
const del = require('del');
const devServer = require('./dev-server');
// @if css-module
const cssModule = require('gulp-dumber-css-module');
// @endif
// @if less
const less = require('gulp-less');
// @endif
// @if sass
const sass = require('gulp-dart-sass');
const sassPackageImporter = require('node-sass-package-importer');
// @endif
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
// @if jasmine || tape || mocha
const gulpRun = require('gulp-run');
// @endif

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const dist = 'dist';

// Read more in https://dumber.js.org
const dr = dumber({
  // src folder is by default "src".
  // src: 'src',

  // requirejs baseUrl, dumber default is "/dist"
  baseUrl: '/' + dist,

  // can turn off cache for production build
  // cache: !isProduction,

  // entry bundle name, dumber default is "entry-bundle"
  // entryBundle: 'entry-bundle',

  // Turn on hash for production build
  hash: isProduction,

  // Note prepend/append only affects entry bundle.

  // prepend before amd loader.
  // dumber-module-loader is injected automatically by dumber bundler after prepends.
  // prepend: [],

  // @if jasmine || tape || mocha
  // append after amd loader and all module definitions in entry bundle.
  append: [
    // Kick off all test files.
    // Note dumber-module-loader requirejs call accepts regex which loads all matched module ids!
    // Note all module ids are relative to dumber option "src" (default to 'src') folder.
    isTest && "requirejs([/^\\.\\.\\/test\\/.+\\.spec$/]);"
  ],
  // @endif

  // Explicit dependencies, can use either "deps" (short name) or "dependencies" (full name).
  // deps: [],

  // Code split is intuitive and flexible.
  // https://dumber.js.org/options/code-split
  //
  // You provide a function to return a bundle name for every single module.
  // The function takes two parameters:
  //
  // moduleId:
  //   for local src file "src/foo/bar.js", the module id is "foo/bar.js"
  //   for local src file "src/foo/bar.css" (or any other non-js file), the module id is "foo/bar.css"
  //   for npm package file "node_modules/foo/bar.js", the module id is "foo/bar.js"
  //   for npm package file "node_modules/@scoped/foo/bar.js", the module id is "@scoped/foo/bar.js"
  //
  // packageName:
  //   for any local src file, the package name is undefined
  //   for npm package file "node_modules/foo/bar.js", the package name is "foo"
  //   for npm package file "node_modules/@scoped/foo/bar.js", the package name is "@scoped/foo"

  // Here we skip code splitting in test mode.
  codeSplit: isTest ? undefined : function(moduleId, packageName) {
    // Here for any local src, put into app-bundle
    if (!packageName) return 'app-bundle';
    // The codeSplit func does not need to return a valid bundle name.
    // For any undefined return, dumber put the module into entry bundle,
    // this means no module can skip bundling.
  },

  // onManifest is an optional callback, it provides a file name map like:
  // {
  //   "some-bundle.js": "some-bundle.1234.js",
  //   "other-bundle.js": "other-bundle.3455.js"
  // }
  // Or when hash is off
  // {
  //   "some-bundle.js": "some-bundle.js",
  //   "other-bundle.js": "other-bundle.js"
  // }
  // If you turned on hash, you need this callback to update index.html
  onManifest: isTest ? undefined : function(filenameMap) {
    // Update index.html entry-bundle.js with entry-bundle.hash...js
    console.log('Update index.html with ' + filenameMap['entry-bundle.js']);
    const indexHtml = fs.readFileSync('_index.html').toString()
      .replace('entry-bundle.js', filenameMap['entry-bundle.js']);

    fs.writeFileSync('index.html', indexHtml);
  }
});

function buildJs(src) {
  // @if typescript
  const ts = typescript.createProject('tsconfig.json', {noEmitOnError: true});
  // @endif
  return gulp.src(src, {sourcemaps: !isProduction})
    .pipe(gulpif(!isProduction && !isTest, plumber()))
    .pipe(au2())
    // @if babel
    .pipe(babel());
    // @endif
    // @if typescript
    .pipe(ts());
    // @endif
}

function buildHtml(src) {
  return gulp.src(src)
    .pipe(gulpif(!isProduction && !isTest, plumber()))
    // @if shadow-dom
    // The other possible Shadow DOM mode is "closed".
    // If you turn on "closed" mode, there will be difficulty to perform e2e
    // tests (such as Cypress). Because shadowRoot is not accessible through
    // standard DOM APIs in "closed" mode.
    .pipe(au2({defaultShadowOptions: {mode: 'open'}}));
    // @endif
    // @if css-module
    .pipe(au2({useCSSModule: true}));
    // @endif
    // @if !shadow-dom && !css-module
    .pipe(au2());
    // @endif
}

function buildCss(src) {
  return gulp.src(src, {sourcemaps: !isProduction})
    // @if less
    .pipe(gulpif(!isProduction && !isTest, plumber()))
    .pipe(gulpif(f => f.extname === '.less', less()))
    // @endif
    // @if sass
    .pipe(gulpif(
      f => f.extname === '.scss',
      // sassPackageImporter handles @import "~bootstrap"
      // https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer
      isProduction || isTest ?
        sass.sync({importer: sassPackageImporter()}) :
        sass.sync({importer: sassPackageImporter()}).on('error', sass.logError)
    ))
    // @endif
    .pipe(postcss([
      autoprefixer(),
      // use postcss-url to inline any image/font/svg.
      // postcss-url by default use base64 for images, but
      // encodeURIComponent for svg which does NOT work on
      // some browsers.
      // Here we enforce base64 encoding for all assets to
      // improve compatibility on svg.
      postcssUrl({url: 'inline', encodeType: 'base64'})
    ]))/* @if css-module */
    .pipe(cssModule())/* @endif */;
}

function build() {
  // Merge all js/css/html file streams to feed dumber.
  // dumber knows nothing about .ts/.less/.scss/.md files,
  // gulp-* plugins transpiled them into js/css/html before
  // sending to dumber.
  return merge2(
    gulp.src('src/**/*.json'),
    // @if babel
    // @if !jasmine && !tape && !mocha
    buildJs('src/**/*.js'),
    // @endif
    // @if jasmine || mocha || tape
    buildJs(isTest ? '{src,test}/**/*.js' : 'src/**/*.js'),
    // @endif
    // @endif
    // @if typescript
    // @if !jasmine && !tape && !mocha
    buildJs('src/**/*.ts'),
    // @endif
    // @if jasmine || mocha || tape
    buildJs(isTest ? '{src,test}/**/*.ts' : 'src/**/*.ts'),
    // @endif
    // @endif
    buildHtml('src/**/*.html'),
    // @if css
    buildCss('src/**/*.css')
    // @endif
    // @if less
    buildCss('src/**/*.{less,css}')
    // @endif
    // @if sass
    buildCss('src/**/*.{scss,css}')
    // @endif
  )
  // Note we did extra call `dr()` here, this is designed to cater watch mode.
  // dumber here consumes (swallows) all incoming Vinyl files,
  // then generates new Vinyl files for all output bundle files.
  .pipe(dr())
  // Terser fast minify mode
  // https://github.com/terser-js/terser#terser-fast-minify-mode
  // It's a good balance on size and speed to turn off compress.
  .pipe(gulpif(isProduction, terser({compress: false})))
  // @if !jasmine && !mocha && !tape
  .pipe(gulp.dest(dist, {sourcemaps: isProduction ? false : '.'}));
  // @endif
  // @if jasmine || mocha || tape
  .pipe(gulp.dest(dist, {sourcemaps: isProduction ? false : (isTest ? true : '.')}));
  // @endif
}

function clean() {
  return del(dist);
}

function clearCache() {
  return dr.clearCache();
}

const serve = gulp.series(
  build,
  function startServer(done) {
    devServer.run({
      open: !process.env.CI,
      port: 9000
    });
    done();
  }
)

// Reload browserSync
function reload(done) {
  console.log('Reloading the browser');
  devServer.reload();
  done();
}

// Watch all files for rebuild and reload browserSync.
function watch() {
  gulp.watch('src/**/*', gulp.series(build, reload));
}

const run = gulp.series(clean, serve, watch);

// @if jasmine || tape || mocha
// Watch all files for rebuild and test.
function watchTest() {
  gulp.watch('{src,test}/**/*', gulp.series(build, test));
}

function test() {
  return gulpRun('npm run test:headless').exec();
}

exports['watch-test'] = watchTest;
// @endif
exports.build = build;
exports.clean = clean;
exports['clear-cache'] = clearCache;
exports.run = run;
exports.default = run;
