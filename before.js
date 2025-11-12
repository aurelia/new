// Use "before" task to ask user to select a preset (to skip questionnaire).

const PRESETS = {
  'default-esnext': ['app', 'vite', 'babel', 'vitest'],
  'default-typescript': ['app', 'vite', 'typescript', 'vitest'],
  'default-esnext-dumber': ['app', 'dumber', 'babel'],
  'default-typescript-dumber': ['app', 'dumber', 'typescript'],
};

const REQUIRE_NODEJS_VESION = [18, 0, 0];

function isNodejsOutdated() {
  const version = process.version.slice(1).split('.');
  for (let i = 0; i < 3; i++) {
    const actual = version[i];
    const required = REQUIRE_NODEJS_VESION[i];
    if (actual > required) return false;
    if (actual < required) return true;
  }
  return false;
}

if (isNodejsOutdated()) {
  console.error('\x1b[31m' + `Aurelia 2 requires at least Nodejs v${REQUIRE_NODEJS_VESION.join('.')}. Your Nodejs version is ${process.version}. Please install latest version from https://nodejs.org` + '\x1b[0m');
  process.exit(1);
}

module.exports = async function({unattended, prompts, ansiColors}) {
  // don't ask when running in silent mode.
  if (unattended) return;

  const preset = await prompts.select({
    message: 'Would you like to use the default setup or customize your choices?',
    choices: [
      {
        value: 'default-typescript',
        title: 'Default TypeScript Aurelia 2 App (Recommended)',
        hint: 'Modern Aurelia 2 app with TypeScript, Vite, and Vitest'
      }, {
        value: 'default-esnext',
        title: 'Default ESNext Aurelia 2 App',
        hint: 'Modern Aurelia 2 app with Babel, Vite, and Vitest'
      }, {
        value: 'default-typescript-dumber',
        title: 'TypeScript Aurelia 2 App with Dumber',
        hint: 'Lightweight Aurelia 2 app with TypeScript and Dumber bundler'
      }, {
        value: 'default-esnext-dumber',
        title: 'ESNext Aurelia 2 App with Dumber',
        hint: 'Lightweight Aurelia 2 app with Babel and Dumber bundler'
      }, {
        title: 'Custom Aurelia 2 Project',
        hint: 'Select bundler, transpiler, and more.'
      }
    ]
  });

  if (preset) {
    const preselectedFeatures = PRESETS[preset];
    if (preselectedFeatures) {
      return {
        silentQuestions: true, // skip following questionnaire
        preselectedFeatures
      };
    }
  }
};
