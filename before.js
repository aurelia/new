// Use "before" task to ask user to select a preset (to skip questionnaire).

const PRESETS = {
  'default-esnext': ['app', 'vite', 'babel', 'vitest'],
  'default-typescript': ['app', 'vite', 'typescript', 'vitest'],
  // TODO: move plugin to vite+vitest
  // FIXME: vite compiles plugin with separate css dist file, and removed
  // import('./style.css') from js code, need to:
  //   1. hook up a css loader in runtime for normal css and css-module.
  //   2. hook up a text loader in runtime for shadow-dom css.
  'default-esnext-plugin': ['plugin', 'webpack', 'babel', 'shadow-dom', 'jest'],
  'default-typescript-plugin': ['plugin', 'webpack', 'typescript', 'shadow-dom', 'jest'],
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
        value: 'default-esnext',
        title: 'Default ESNext Aurelia 2 App',
        hint: 'A basic Aurelia 2 app with Babel and Vite'
      }, {
        value: 'default-typescript',
        title: 'Default TypeScript Aurelia 2 App',
        hint: 'A basic Aurelia 2 app with TypeScript and Vite'
      }, {
        value: 'default-esnext-plugin',
        title: 'Default ESNext Aurelia 2 Plugin',
        hint: 'A basic Aurelia 2 plugin project with Babel, Webpack and ShadowDOM'
      }, {
        value: 'default-typescript-plugin',
        title: 'Default TypeScript Aurelia 2 Plugin',
        hint: 'A basic Aurelia 2 plugin project with TypeScript, Webpack and ShadowDOM'
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
