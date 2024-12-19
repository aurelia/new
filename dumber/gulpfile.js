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
const devServer = require('./dev-server');
// @if css-module
const cssModule = require('gulp-dumber-css-module');
// @endif
// @if sass
const sass = require('gulp-dart-sass');
const sassPackageImporter = require('node-sass-package-importer');
// @endif
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');

const isProduction = process.env.NODE_ENV === 'production';
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
  entryBundle: 'entry.bundle',

  // Turn on hash for production build
  hash: isProduction,

  // Note prepend/append only affects entry bundle.

  // prepend before amd loader.
  // dumber-module-loader is injected automatically by dumber bundler after prepends.
  // prepend: [],

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

  codeSplit: function (moduleId, packageName) {
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
  onManifest: function (filenameMap) {
    // Update index.html entry.bundle.js with entry.bundle.hash...js
    console.log('Update index.html with ' + filenameMap['entry.bundle.js']);
    const indexHtml = fs.readFileSync('_index.html').toString()
      .replace('entry.bundle.js', filenameMap['entry.bundle.js']);

    fs.writeFileSync('index.html', indexHtml);
  }
});

function buildJs(src) {
  // @if typescript
  const ts = typescript.createProject('tsconfig.json', { noEmitOnError: true });
  // @endif
  return gulp.src(src, { sourcemaps: !isProduction })
    .pipe(gulpif(!isProduction, plumber()))
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
    .pipe(gulpif(!isProduction, plumber()))
    // @if shadow-dom
    // The other possible Shadow DOM mode is "closed".
    // If you turn on "closed" mode, there will be difficulty to perform e2e
    // tests (such as Playwright). Because shadowRoot is not accessible through
    // standard DOM APIs in "closed" mode.
    .pipe(au2({ defaultShadowOptions: { mode: 'open' }, hmr: false }));
    // @endif
    // @if !shadow-dom
    .pipe(au2({ hmr: false }));
  // @endif
}

function buildCss(src) {
  return gulp.src(src, { sourcemaps: !isProduction })
    // @if sass
    .pipe(gulpif(
      f => f.extname === '.scss',
      // sassPackageImporter handles @import "~bootstrap"
      // https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer
      isProduction ?
        sass.sync({ quietDeps: true, importer: sassPackageImporter() }) :
        sass.sync({ quietDeps: true, importer: sassPackageImporter() }).on('error', sass.logError)
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
      postcssUrl({ url: 'inline', encodeType: 'base64' })
    ]))/* @if css-module */
    // Use .module.css naming convention
    .pipe(gulpif(f => f.basename.endsWith('.module.css'), cssModule()))/* @endif */;
}

function build() {
  // Merge all js/css/html file streams to feed dumber.
  // dumber knows nothing about .ts/.scss/.md files,
  // gulp-* plugins transpiled them into js/css/html before
  // sending to dumber.
  return merge2(
    gulp.src('src/**/*.json'),
    // @if babel
    buildJs('src/**/*.js'),
    // @endif
    // @if typescript
    buildJs('src/**/*.ts'),
    // @endif
    buildHtml('src/**/*.html'),
    // @if css
    buildCss('src/**/*.css')
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
    .pipe(gulpif(isProduction, terser({ compress: false })))
    .pipe(gulp.dest(dist, { sourcemaps: isProduction ? false : '.' }));
}

function clean() {
  return fs.promises.rm(dist, { recursive: true, force: true });
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

// Reload dev server
function reload(done) {
  console.log('Reloading the browser');
  devServer.reload();
  done();
}

// Watch all files for rebuild and reload dev server.
function watch() {
  gulp.watch('src/**/*', gulp.series(build, reload));
}

const run = gulp.series(clean, serve, watch);

exports.build = build;
exports.clean = clean;
exports['clear-cache'] = clearCache;
exports.run = run;
exports.default = run;
