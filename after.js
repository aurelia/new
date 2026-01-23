// Use "after" task to ask user to install deps.

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const PNPM_NPMRC = [
  '# for pnpm, use flat node_modules',
  'shamefully-hoist=true',
  'auto-install-peers=true',
  ''
].join('\n');

function isAvailable(bin) {
  try {
    execSync(bin + ' -v', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async function({
  unattended, here, prompts, run, properties, features, notDefaultFeatures, ansiColors
}, {
  // for testing
  _isAvailable = isAvailable,
  _log = console.log
} = {}) {
  const c = ansiColors;
  let depsInstalled = false;
  let packageManager = undefined;
  const projectDir = here ? '.' : properties.name;

  if (!unattended) {
    const choices = [ {value: 'npm', title: 'Yes, use npm'} ];

    if (_isAvailable('yarn')) {
      choices.push({value: 'yarn', title: 'Yes, use yarn (node-modules)'});
    }

    if (_isAvailable('pnpm')) {
      choices.push({value: 'pnpm', title: 'Yes, use pnpm'});
    }

    choices.push({title: 'No'});

    packageManager = await prompts.select({
      message: 'Do you want to install npm dependencies now?',
      choices
    });

    if (packageManager) {
      if (packageManager === 'pnpm') {
        ensurePnpmrc(projectDir);
      }
      await run(packageManager, ['install']);

      if (features.includes('playwright')) {
        if (packageManager === 'npm') {
          await run('npx', ['playwright', 'install', '--with-deps']);
        } else {
          await run(packageManager, ['dlx', 'playwright', 'install', '--with-deps']);
        }
      }
      depsInstalled = true;
    }

    _log(`\nNext time, you can try to create similar project in silent mode:`);
    _log(c.inverse(` npx makes aurelia new-project-name${here ? ' --here' : ''} -s ${notDefaultFeatures.length ? (notDefaultFeatures.join(',') + ' ') : ''}`));
  }

  // Setup Storybook directory and files
  if (features.includes('storybook')) {
    try {
      // Navigate to project directory if we're not in it already
      const projectDir = here ? '.' : properties.name;
      const originalCwd = process.cwd();

      if (!here && fs.existsSync(projectDir)) {
        process.chdir(projectDir);
      }

      // Create .storybook directory
      if (!fs.existsSync('.storybook')) {
        fs.mkdirSync('.storybook');
      }

      // Move and rename storybook configuration files
      const extension = features.includes('typescript') ? '.ts' : '.js';

      const mainFile = `storybook-main${extension}`;
      const previewFile = `storybook-preview${extension}`;

      if (fs.existsSync(mainFile)) {
        fs.renameSync(mainFile, `.storybook/main${extension}`);
      }

      if (fs.existsSync(previewFile)) {
        fs.renameSync(previewFile, `.storybook/preview${extension}`);
      }

      // Return to original directory
      if (!here && originalCwd !== process.cwd()) {
        process.chdir(originalCwd);
      }
    } catch (error) {
      _log(c.yellow(`Warning: Could not setup .storybook directory: ${error.message}`));
    }
  }

  _log(`\n${c.underline.bold('Get Started')}`);
  if (!here) _log('cd ' + properties.name);

  if (!depsInstalled) {
    _log('npm install');
    if (features.includes('playwright')) _log('npx playwright install --with-deps');
  }
  _log((packageManager ?? 'npm') + ' start\n');
};

function ensurePnpmrc(projectDir) {
  if (!projectDir || !fs.existsSync(projectDir)) return;

  const npmrcPath = path.join(projectDir, '.npmrc');
  if (!fs.existsSync(npmrcPath)) {
    fs.writeFileSync(npmrcPath, PNPM_NPMRC);
    return;
  }

  const existing = fs.readFileSync(npmrcPath, 'utf8');
  if (existing.includes('shamefully-hoist=') && existing.includes('auto-install-peers=')) return;

  const spacer = existing.endsWith('\n') ? '' : '\n';
  fs.writeFileSync(npmrcPath, existing + spacer + PNPM_NPMRC);
}
