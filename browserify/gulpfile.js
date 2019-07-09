const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback/lib');
// @if babel
const babelify = require('babelify');
// @endif
// @if typescript
const tsify = require('tsify');
// @endif
const stringify = require('stringify');

const b = browserify({
    baseDir: '.',
    debug: process.env.NODE_ENV !== 'production',
    // @if babel
    entries: ['src/main.js'],
    // @endif
    // @if typescript
    entries: ['src/main.ts'],
    // @endif
    cache: {},
    packageCache: {}
  })
  // @if babel
  .transform(babelify)
  // @endif
  // @if typescript
  .plugin(tsify)
  // @endif
  .transform(stringify, {
    appliesTo: { includeExtensions: ['.html'] }
  });

b.on('log', console.log);

function startServer(done) {
  browserSync.init({
    ghostMode: false,
    online: false,
    watch: true, // watch dist/bundle.js
    open: !process.env.CI,
    server: {
      baseDir: ['.'],
      middleware: [
        // connect-history-api-fallback is a tool to help SPA dev.
        // So in dev mode, http://localhost:port/some/route will get
        // the same /index.html as content, instead off 404 at /some/route
        historyApiFallback(),
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      ]
    }
  }, function(err, bs) {
    if (err) return done(err);
    let urls = bs.options.get('urls').toJS();
    console.log(`Application Available At: ${urls.local}`);
    console.log(`BrowserSync Available At: ${urls.ui}`);
    done();
  });
}

function bundle(input) {
  return input.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
}

function build() {
  return bundle(b);
}

function watch() {
  const w = watchify(b);
  b.on('update', () => bundle(w));
  b.on('bundle', browserSync.reload);
  return bundle(w);
}

exports.build = build;
exports.default = gulp.series(
  startServer,
  watch
);
