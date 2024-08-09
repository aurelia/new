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