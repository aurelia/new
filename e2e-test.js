// This test is not required by "makes" at all.
// It's to ensure all the skeletons here do (kind of) work.
// The whole test suite takes long long time to finish,
// it's not automatically triggered by "npm version patch".
// Have to run "npm run test:e2e" manually before a release.

const spawn = require('cross-spawn');
const os = require('os');
const fs = require('fs');
const path = require('path');
const test = require('ava');
const kill = require('tree-kill');
const {possibleFeatureSelections} = require('makes');
const questions = require('./questions');

async function delay(secs) {
  return new Promise((resolve) => {
    setTimeout(resolve, secs);
  });
}

const allSkeletons = possibleFeatureSelections(questions);

const isWin32 = process.platform === 'win32';

const folder = path.join(os.tmpdir(), 'test-skeletons');
console.log('-- cleanup ' + folder);
fs.rmSync(folder, {recursive: true, force: true});
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

function run(command, cwd, dataCB, errorCB) {
  const [cmd, ...args] = command.split(' ');
  return new Promise((resolve, reject) => {
    const env = Object.create(process.env);
    // use CI to turn off automatic browser opening in tasks/run.js
    env.CI = 'true';
    // need to reset NODE_ENV back to development because this whole
    // test is running in NODE_ENV=test which will affect gulp build
    env.NODE_ENV = 'development';
    const proc = spawn(cmd, args, {env, cwd});
    proc.on('exit', async (code, signal) => {
      await delay(1);
      if (code && signal !== 'SIGTERM' && !win32Killed.has(proc.pid)) {
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
      // Skip BABEL warning (used by dumber bundler) when reading @aurelia/runtime-html
      if (data.toString().includes('The code generator has deoptimised the styling')) return;
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

const targetFeatures = (process.env.TARGET_FEATURES || '').toLowerCase().split(',').filter(p => p);
if (!targetFeatures.includes('playwright')) {
  targetFeatures.push('playwright');
}

if (!targetFeatures.includes('app-min')) {
  // Skipped app-with-router for now
  targetFeatures.push('app-min');
}

if (targetFeatures.length) {
  console.log('Target features: ', targetFeatures);
}

function getServerRegex(features) {
  if (features.includes('webpack')) return /Loopback: (\S+)/;
  if (features.includes('parcel')) return /Server running at (\S+)/;
  if (features.includes('vite')) return /(http:\/\/\S+\/)/;
  return /Dev server is started at: (\S+)/;
}

const skeletons = allSkeletons.filter(features =>
  targetFeatures.length === 0 || targetFeatures.every(f => features.includes(f))
);

skeletons.forEach((features, i) => {
  const appName = features.join('-');
  const appFolder = path.join(folder, appName);
  const title = `App: ${i + 1}/${skeletons.length} ${appName}`;
  const serverRegex = getServerRegex(features);

  test.serial(title, async t => {
    console.log(title);

    const makeCmd = `npx makes ${__dirname} ${appName} -s ${features.join(',')}`;
    console.log('-- ' + makeCmd);
    await run(makeCmd, folder);
    t.pass('made skeleton');

    console.log('-- npm i');
    await run('npm i', appFolder);
    t.pass('installed deps');

    if (!features.includes('no-unit-tests')) {
      console.log('-- npm test');
      await run('npm test', appFolder);
      t.pass('finished unit tests');
    }

    console.log('-- npm run build');
    await run('npm run build', appFolder, null,
      (data, kill) => {
        // Skip parcel warnings.
        if (features.includes('parcel')) return;
        t.fail('build failed: ' + data.toString());
      }
    );
    t.pass('made dev build');

    const distPath = path.join(appFolder, 'dist');
    const compiledFiles = fs.readdirSync(distPath);
    t.truthy(compiledFiles.length);

    console.log('-- npm start');
    const runE2e = async (data, kill) => {
      const m = data.toString().match(serverRegex);
      if (!m) return;
      const url = m[1];
      t.pass(m[0]);
      kill();
    };

    // Webpack5 now prints Loopback: http://localhost:5000 in stderr!
    await run('npm start', appFolder, runE2e, runE2e);

    if (features.includes('playwright')) {
      console.log('-- npx playwright test --project chromium');
      await run('npx playwright install --with-deps', appFolder);
      await run('npx playwright test --project chromium', appFolder);
    }

    await delay(1);

    console.log('-- remove folder ' + appName);
    await fs.promises.rm(appFolder, {recursive: true});
  });
});
