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
const kill = require('tree-kill');
const {possibleFeatureSelections} = require('makes');
const questions = require('./questions');
const allSkeletons = possibleFeatureSelections(questions);

const isWin32 = process.platform === 'win32';
const dir = __dirname;

const folder = path.join(dir, 'test-skeletons');
console.log('-- cleanup ' + folder);
del.sync(folder);
fs.mkdirSync(folder);

// Somehow taskkill on windows would not send SIGTERM signal to proc,
// The proc killed by taskkill got null signal.
const win32Killed = new Set();
function killProc(proc) {
  if (isWin32) {
    win32Killed.add(proc.pid);
  }
  proc.stdin.pause();
  kill(proc.pid);
}


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
        if (isWin32 && args[1] === 'test:e2e' && code === 3221226356) {
          // There is random cypress ELIFECYCLE (3221226356) issue on Windows.
          // Probably related to https://github.com/cypress-io/cypress/pull/2011
          resolve();
          return;
        }
        reject(new Error(cmd + ' ' + args.join(' ') + ' process exit code: ' + code + ' signal: ' + signal));
      } else {
        resolve();
      }
    });
    proc.on('error', reject);
    proc.stdout.on('data', data => {
      process.stdout.write(data);
      if (dataCB) {
        dataCB(data, () => {
          console.log(`-- kill "${command}"`);
          killProc(proc);
        });
      }
    });
    proc.stderr.on('data', data => {
      process.stderr.write(data);
      // Skip webpack5 deprecation warning.
      if (data.toString().includes('DeprecationWarning')) return;
      // webpack-dev-server v4 prints <i> [webpack-dev-server] Project is running at http://0.0.0.0:9000/ to stderr instead of stdout
      if (data.toString().startsWith('<i>') && dataCB) {
        dataCB(data, () => {
          console.log(`-- kill "${command}"`);
          killProc(proc);
        });
      }
      if (errorCB) {
        errorCB(data, () => {
          console.log(`-- kill "${command}"`);
          // process.stderr.write(data);
          killProc(proc);
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
if (!targetFeatures.includes('cypress')) {
  targetFeatures.push('cypress');
}
if (!targetFeatures.includes('app-min')) {
  // Skipped app-with-router for now
  targetFeatures.push('app-min');
}

if (targetFeatures.length) {
  console.log('Target features: ', targetFeatures);
}

function getServerRegex(features) {
  if (features.includes('webpack')) return /Project is running at (\S+)/;
  if (features.includes('parcel')) return /Server running at (\S+)/;
  if (features.includes('fuse-box')) return /Development server running (\S+)/;
  return /Dev server is started at: (\S+)/;
}

function getStartCommand(features) {
  // don't open browser for parcel
  if (features.includes('parcel')) return 'npx parcel index.html -p 9000 --no-autoinstall';
  return 'npm start';
}

const skeletons = allSkeletons.filter(features =>
  targetFeatures.length === 0 || targetFeatures.every(f => features.includes(f))
);

skeletons.forEach((features, i) => {
  const appName = features.join('-');
  const appFolder = path.join(folder, appName);
  const title = `App: ${i + 1}/${skeletons.length} ${appName}`;
  const serverRegex = getServerRegex(features);
  const startCommand = getStartCommand(features);

  test.serial(title, async t => {
    console.log(title);
    process.chdir(folder);

    const makeCmd = `npx makes ${dir} ${appName} -s ${features.join(',')}`;
    console.log('-- ' + makeCmd);
    await run(makeCmd);
    t.pass('made skeleton');
    process.chdir(appFolder);

    console.log('-- yarn');
    await run('yarn');
    t.pass('installed deps');

    if (!features.includes('no-unit-tests')) {
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
        t.pass(m[0]);

        try {
          if (!process.env.GITHUB_ACTIONS) {
            console.log('-- take screenshot');
            await takeScreenshot(url, path.join(folder, appName + '.png'));
          }

          if (isWin32 && features.includes('cypress')) {
            // Have to by pass start-server-and-test on win32
            // due to cypress issue (3221226356, search above)
            console.log('-- npm run cypress');
            await run(`npm run cypress`);
          }
          kill();
        } catch (e) {
          t.fail(e.message);
          kill();
        }
      }
    );

    if (!isWin32 && features.includes('cypress')) {
      console.log('-- npm run test:e2e');
      await run(`npm run test:e2e`);
    }

    console.log('-- remove folder ' + appName);
    process.chdir(folder);
    await del(appFolder);
  });
});
