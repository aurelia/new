// Use "before" task to ask user to select a preset (to skip questionnaire).

const PRESETS = {
  'default-esnext': ['webpack', 'babel', 'jest'],
  'default-typescript': ['webpack', 'typescript', 'jest'],
};

module.exports = async function({unattended, prompts}) {
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
