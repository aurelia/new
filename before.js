// Use "before" task to ask user to select a preset (to skip questionnaire).

const PRESETS = {
  'default-esnext': ['app', 'vite', 'babel', 'vitest'],
  'default-typescript': ['app', 'vite', 'typescript', 'vitest'],
  'minimal-esnext': ['app', 'vite', 'babel', 'no-unit-tests', 'app-blank', 'css'],
  'minimal-typescript': ['app', 'vite', 'typescript', 'no-unit-tests', 'app-blank', 'css'],
  'lean-modern-frontend': ['app', 'vite', 'typescript', 'vitest', 'tailwindcss', 'storybook', 'app-min'],
  'default-esnext-plugin': ['plugin', 'vite', 'babel', 'shadow-dom', 'vitest'],
  'default-typescript-plugin': ['plugin', 'vite', 'typescript', 'shadow-dom', 'vitest'],
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
        hint: 'Babel + Vite + Vitest with basic sample'
      }, {
        value: 'minimal-esnext',
        title: 'Minimal ESNext Aurelia 2 App',
        hint: 'Vite + Babel, no tests, blank sample'
      }, {
        value: 'default-typescript',
        title: 'Default TypeScript Aurelia 2 App',
        hint: 'TypeScript + Vite + Vitest with basic sample'
      }, {
        value: 'minimal-typescript',
        title: 'Minimal TypeScript Aurelia 2 App',
        hint: 'TypeScript + Vite, no tests, blank sample'
      }, {
        value: 'lean-modern-frontend',
        title: 'Lean Modern Frontend',
        hint: 'TypeScript + Vite + Tailwind + Vitest + Storybook (app-min)'
      }, {
        value: 'default-esnext-plugin',
        title: 'Default ESNext Aurelia 2 Plugin',
        hint: 'A basic Aurelia 2 plugin project with Babel, Vite and ShadowDOM'
      }, {
        value: 'default-typescript-plugin',
        title: 'Default TypeScript Aurelia 2 Plugin',
        hint: 'A basic Aurelia 2 plugin project with TypeScript, Vite and ShadowDOM'
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
