module.exports = [
  {
    message: 'What kind of Aurelia 2 project?',
    choices: [
      { value: 'app', title: 'Application', hint: 'An Aurelia 2 Single-Page-Application' },
      { value: 'plugin', title: 'Plugin', hint: 'An Aurelia 2 plugin project' },
    ]
  },
  {
    message: 'What Aurelia 2 release would you like to use?',
    choices: [
      {value: 'latest', title: 'Latest', hint: 'Target latest v2.x.x release'},
      {value: 'dev', title: 'Dev (nightly)', hint: 'Target nightly development release'},
    ]
  },
  {
    message: 'Which bundler would you like to use?',
    choices: [
      {value: 'vite', title: 'Vite', hint: 'Next Generation Frontend Tooling.'},
      {if: 'app', value: 'webpack', title: 'Webpack', hint: 'A powerful and popular bundler for modern JavaScript apps.'},
      {if: 'app', value: 'dumber', title: 'Dumber', hint: 'A dumb JavasScript bundler, dumber than you and me. The successor of Aurelia CLI built-in bundler.'},
      {if: 'app', value: 'parcel', title: 'Parcel', hint: 'Blazing fast, zero configuration web application bundler.'},
    ]
  },
  {
    message: 'What transpiler would you like to use?',
    choices: [
      {value: 'babel', title: 'Babel', hint: 'An open source, standards-compliant ES2015 and ESNext transpiler.'},
      {value: 'typescript', title: 'TypeScript', hint: 'An open source, ESNext superset that adds optional strong typing.'}
    ]
  },
  {
    message: 'Do you want to use Shadow DOM or CSS Module?',
    choices: [
      {title: 'No'},
      {if: 'app', value: 'shadow-dom', title: 'Use Shadow DOM', hint: 'Shadow DOM in open mode, shadowRoot is accessible through DOM API.'},
      {if: 'plugin', value: 'shadow-dom', title: 'Use Shadow DOM (Recommended for plugin project)', hint: 'Shadow DOM in open mode, shadowRoot is accessible through DOM API.'},
      {value: 'css-module', title: 'Use CSS Module', hint: 'CSS Module is an alternative way to locally scope CSS class names. We use .module.css/less/scss file name convention.'},
    ]
  },
  {
    message: 'What CSS preprocessor to use?',
    choices: [
      {value: 'css', title: 'Plain CSS'},
      {value: 'less', title: 'Less (.less)'},
      {value: 'sass', title: 'Sass (.scss)'}
    ]
  },
  {
    message: 'What unit testing framework to use?',
    choices: [
      {value: 'no-unit-tests', title: 'None', hint: 'No unit testing'},
      {if: '!vite', value: 'jest', title: 'Jest', hint: 'Runs in Node.js, simulates browser by default, with a focus on simplicity.'},
      {if: '!vite', value: 'jasmine', title: 'Jasmine', hint: 'Runs in browser, a behavior-driven testing framework.'},
      {if: '!vite', value: 'mocha', title: 'Mocha + Chai', hint: 'Runs in browser, a feature-rich JavaScript test framework for node and browsers.'},
      {if: 'vite', value: 'vitest', title:'Vitest', hint: 'A Vite-native testing framework.'}
    ]
  },
  {
    message: 'Do you want to setup e2e test?',
    choices: [
      {title: 'No'},
      // TODO setup e2e for plugin project too.
      {if: 'app', value: 'playwright', title: 'Yes (Playwright)', hint: 'Playwright enables reliable end-to-end testing for modern web apps.'}
    ]
  },
  {

    message: 'What kind of sample code do you want in this project?',
    choices: [
      {if: 'app', value: 'app-min', title: 'Bare minimum'},
      {if: 'app', value: 'app-with-router', title: 'With direct routing'},
      {if: 'plugin', value: 'plugin-min', title: 'Bare minimum'},
    ]
  },
  // Currently this question is not visible to end user because there is only one option.
  // Will expand the list in future, after Aurelia 2 offered IE11 compatible dist file.
  {
    message: 'What are your targeted browsers?',
    choices: [
      {value: 'browser-evergreen', title: 'All Evergreen browsers', hint: 'Including Chrome, Edge, Firefox, Safari'},
      // Pending Aurelia 2 to ship IE11 compatible dist.
      // {if: 'app', value: 'browser-ie11', title: 'IE11 :-('}
    ]
  }
];
