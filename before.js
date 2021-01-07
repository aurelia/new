// Use "before" task to ask user to select a preset (to skip questionnaire).

const PRESETS = {
  'default-esnext': ['webpack', 'babel', 'jest'],
  'default-typescript': ['webpack', 'typescript', 'jest'],
};

const REQUIRE_NODEJS_VESION = [14, 15, 0];

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

module.exports = async function({unattended, prompts, ansiColors}) {
  if (isNodejsOutdated()) {
    throw new Error(ansiColors.red(`Aurelia 2 requires at least Nodejs v${REQUIRE_NODEJS_VESION.join('.')}. Your Nodejs version is ${process.version}. Please install latest version from https://nodejs.org`));
  }

  // don't ask when running in silent mode.
  if (unattended) return;

  const preset = await prompts.select({
    message: 'Would you like to use the default setup or customize your choices?',
    choices: [
      {
        value: 'default-esnext',
        title: 'Default ESNext Aurelia 2 App',
        hint: 'A basic Aurelia 2 App with Babel and Webpack'
      }, {
        value: 'default-typescript',
        title: 'Default TypeScript Aurelia 2 App',
        hint: 'A basic Aurelia 2 App with TypeScript and Webpack'
      }, {
        title: 'Custom Aurelia 2 App',
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
