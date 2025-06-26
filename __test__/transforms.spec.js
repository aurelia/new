const test = require('ava');
const Vinyl = require('vinyl');
const {Writable} = require('stream');
const {append} = require('../transforms');
const extTransform = append;

test('Only one append transform', t => {
  t.is(typeof extTransform, 'function');
});

test.cb('ext-transform translates .ext file to .js file when typescript is not selected', t => {
  const jsExt = extTransform({}, []);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 2);
    t.is(files[0].path.replace(/\\/g, '/'), 'test/a.js');
    t.is(files[0].contents.toString(), 'var a = 1;');
    t.is(files[1].path.replace(/\\/g, '/'), 'test/b.html');
    t.is(files[1].contents.toString(), '<p></p>');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/a.ext',
    contents: Buffer.from('var a = 1;')
  }));

  jsExt.end(new Vinyl({
    path: 'test/b.html',
    contents: Buffer.from('<p></p>')
  }));
});

test.cb('ext-transform translates .ext file to .ts file when typescript is selected', t => {
  const jsExt = extTransform({}, ['typescript']);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 2);
    t.is(files[0].path.replace(/\\/g, '/'), 'test/a.ts');
    t.is(files[0].contents.toString(), 'var a = 1;');
    t.is(files[1].path.replace(/\\/g, '/'), 'test/b.html');
    t.is(files[1].contents.toString(), '<p></p>');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/a.ext',
    contents: Buffer.from('var a = 1;')
  }));

  jsExt.end(new Vinyl({
    path: 'test/b.html',
    contents: Buffer.from('<p></p>')
  }));
});

test.cb('ext-transform translates css files to .module.css files when css-module is selected', t => {
  const jsExt = extTransform({}, ['css-module']);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 2);
    t.is(files[0].path.replace(/\\/g, '/'), 'test/a.module.css');
    t.is(files[0].contents.toString(), '.p { color: green; }');
    t.is(files[1].path.replace(/\\/g, '/'), 'test/b.module.scss');
    t.is(files[1].contents.toString(), '.p { color: red; }');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/a.css',
    contents: Buffer.from('.p { color: green; }')
  }));

  jsExt.end(new Vinyl({
    path: 'test/b.scss',
    contents: Buffer.from('.p { color: red; }')
  }));
});

test.cb('ext-transform leaves css files untouched files when css-module is not selected', t => {
  const jsExt = extTransform({}, ['']);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 2);
    t.is(files[0].path.replace(/\\/g, '/'), 'test/a.css');
    t.is(files[0].contents.toString(), '.p { color: green; }');
    t.is(files[1].path.replace(/\\/g, '/'), 'test/b.scss');
    t.is(files[1].contents.toString(), '.p { color: red; }');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/a.css',
    contents: Buffer.from('.p { color: green; }')
  }));

  jsExt.end(new Vinyl({
    path: 'test/b.scss',
    contents: Buffer.from('.p { color: red; }')
  }));
});

test.cb('ext-transform works correctly with TailwindCSS feature selected', t => {
  const jsExt = extTransform({}, ['tailwindcss', 'typescript']);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 3);
    // .ext files should be transformed to .ts when typescript is selected
    t.is(files[0].path.replace(/\\/g, '/'), 'test/main.ts');
    t.is(files[0].contents.toString(), 'import Aurelia from "aurelia";');
    // CSS files should remain unchanged
    t.is(files[1].path.replace(/\\/g, '/'), 'test/styles.css');
    t.is(files[1].contents.toString(), '@import "tailwindcss";');
    // HTML files should remain unchanged
    t.is(files[2].path.replace(/\\/g, '/'), 'test/app.html');
    t.is(files[2].contents.toString(), '<div class="bg-blue-500">Hello</div>');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/main.ext',
    contents: Buffer.from('import Aurelia from "aurelia";')
  }));

  jsExt.write(new Vinyl({
    path: 'test/styles.css',
    contents: Buffer.from('@import "tailwindcss";')
  }));

  jsExt.end(new Vinyl({
    path: 'test/app.html',
    contents: Buffer.from('<div class="bg-blue-500">Hello</div>')
  }));
});

test.cb('ext-transform works correctly with TailwindCSS and css-module features combined', t => {
  const jsExt = extTransform({}, ['tailwindcss', 'css-module']);
  const files = [];

  jsExt.pipe(new Writable({
    objectMode: true,
    write(file, enc, cb) {
      files.push(file);
      cb();
    }
  }));

  jsExt.on('end', () => {
    t.is(files.length, 2);
    // .ext files should be transformed to .js when typescript is not selected
    t.is(files[0].path.replace(/\\/g, '/'), 'test/main.js');
    t.is(files[0].contents.toString(), 'import Aurelia from "aurelia";');
    // CSS files should be transformed to .module.css when css-module is selected
    t.is(files[1].path.replace(/\\/g, '/'), 'test/component.module.css');
    t.is(files[1].contents.toString(), '.button { @apply bg-blue-500; }');
    t.end();
  })

  jsExt.write(new Vinyl({
    path: 'test/main.ext',
    contents: Buffer.from('import Aurelia from "aurelia";')
  }));

  jsExt.end(new Vinyl({
    path: 'test/component.css',
    contents: Buffer.from('.button { @apply bg-blue-500; }')
  }));
});