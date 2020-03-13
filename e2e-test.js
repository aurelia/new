// This test is not required by "makes" at all.
// It's to ensure all the skeletons here do (kind of) work.
// The whole test suite takes long long time to finish,
// it's not automatically triggered by "npm version patch".
// Have to run "npm run test:e2e" manually before a release.

const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const del = require('del');
const test = require('ava');
const puppeteer = require('puppeteer');

// Somehow taskkill on windows would not send SIGTERM signal to proc,
// The proc killed by taskkill got null signal.
const win32Killed = new Set();
function killProc(proc) {
  if (process.platform === 'win32') {
    win32Killed.add(proc.pid);
    spawn.sync('taskkill', ["/pid", proc.pid, '/f', '/t']);
  } else {
    proc.stdin.pause();
    proc.kill();
  }
}

const dir = __dirname;

const folder = path.join(dir, 'test-skeletons');
console.log('-- cleanup ' + folder);
del.sync(folder);
fs.mkdirSync(folder);

function run(command, dataCB, errorCB) {
  const [cmd, ...args] = command.split(' ');
  return new Promise((resolve, reject) => {
    const env = Object.create(process.env);
    // use CI to turn off automatic browser opening in tasks/run.js
    env.CI = 'true';
    // need to reset NODE_ENV back to development because this whole
    // test is running in NODE_ENV=test which will affect gulp build
    env.NODE_ENV = 'development';
    const proc = spawn(cmd, args, {env});
    proc.on('exit', (code, signal) => {
      if (code && signal !== 'SIGTERM' && !win32Killed.has(proc.pid)) {
        reject(new Error(cmd + ' ' + args.join(' ') + ' process exit code: ' + code + ' signal: ' + signal));
      } else {
        resolve();
      }
    });
    proc.on('error', reject);
    proc.stdout.on('data', data => {
      // console.log('# ' + data.toString());
      if (dataCB) {
        dataCB(data, () => {
          killProc(proc);
          // resolve()
        });
      }
    });
    proc.stderr.on('data', data => {
      process.stderr.write(data);
      if (errorCB) {
        errorCB(data, () => {
          killProc(proc);
          // resolve();
        });
      }
    })
  });
}

async function takeScreenshot(url, filePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({path: filePath});
  await browser.close();
}

const targetFeatures = (process.env.TARGET_FEATURES || '').toLowerCase().split(',').filter(p => p);
if (targetFeatures.length) {
  console.log('Target features: ', targetFeatures);
}
const bundlers = ['webpack', 'dumber'];
const transpilers = ['babel', 'typescript'];
const cssModes = ['no-css-mode', 'shadow-dom', 'css-module'];
const cssProcessors = ['css', 'sass', 'less'];
const testFrameworks = ['jasmine', 'tape', 'mocha', 'no-unit-tests'];
const e2eFrameworks = ['cypress'];

function getServerRegex(features) {
  if (features.includes('webpack')) return /Project is running at (\S+)/;
  if (features.includes('parcel')) return /Server running at (\S+)/;
  if (features.includes('fuse-box')) return /Development server running (\S+)/;
  return /Application Available At: (\S+)/;
}

function getStartCommand(features) {
  // don't open browser for parcel
  if (features.includes('parcel')) return 'npx parcel index.html -p 9000 --no-autoinstall';
  return 'npm start';
}

const skeletons = [];
bundlers.forEach(bundler => {
  transpilers.forEach(transpiler => {
    cssModes.forEach(cssMode => {
      cssProcessors.forEach(cssProcessor => {
        testFrameworks.forEach(testFramework => {
          e2eFrameworks.forEach(e2eFramework => {
            const features = [bundler, transpiler, cssMode, cssProcessor, testFramework, e2eFramework].filter(p => p);
            if (targetFeatures.length === 0 || targetFeatures.every(f => features.includes(f))) {
              skeletons.push(features);
            }
          })
        });
      });
    });
  });
});

skeletons.forEach((features, i) => {
  const appName = features.join('-');
  const appFolder = path.join(folder, appName);
  const title = `App: ${i + 1}/${skeletons.length} ${appName}`;
  const serverRegex = getServerRegex(features);
  const startCommand = getStartCommand(features);
  const hasUnitTests = !features.includes('no-unit-tests');

  test.serial(title, async t => {
    console.log(title);
    process.chdir(folder);

    const makeCmd = `npx makes ${dir} ${appName} -s ${features.join(',')}`;
    console.log('-- ' + makeCmd);
    await run(makeCmd);
    t.pass('made skeleton');
    process.chdir(appFolder);

    console.log('-- yarn install');
    await run('yarn install');
    t.pass('installed deps');

    if (hasUnitTests) {
      console.log('-- npm test');
      await run('npm test');
      t.pass('finished unit tests');
    }

    console.log('-- npm run build');
    await run('npm run build', null,
      (data, kill) => {
        t.fail('build failed: ' + data.toString());
      }
    );
    t.pass('made dev build');

    const distPath = path.join(appFolder, 'dist');
    const compiledFiles = fs.readdirSync(distPath);
    t.truthy(compiledFiles.length);

    console.log('-- ' + startCommand);
    await run(startCommand,
      async (data, kill) => {
        const m = data.toString().match(serverRegex);
        if (!m) return;
        const url = m[1];
        const message = 'Dev server is started at ' + url;
        console.log(message);
        t.pass(message);

        try {
          console.log('-- take screenshot');
          await takeScreenshot(url, path.join(folder, appName + '.png'));

          console.log('-- npm run test:e2e');
          await run(`npm run test:e2e`);
          kill();
        } catch (e) {
          t.fail(e);
          kill();
        }
      },
      (data, kill) => {
        const str = data.toString();
        // ignore nodejs v12 [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
        if (!str.includes('DeprecationWarning')) {
          t.fail('npm start failed: ' + data.toString());
          kill();
        }
      }
    );

    // console.log('-- remove folder ' + appName);
    // process.chdir(folder);
    // await del(appFolder);
  });
});
