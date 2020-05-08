const questions = [
  {
    message: 'Which bundler would you like to use?',
    choices: [
      {value: 'webpack', title: 'Webpack', hint: 'A powerful and popular bundler for modern JavaScript apps.'},
      {value: 'dumber', title: 'Dumber', hint: 'A dumb JavasScript bundler, dumber than you and me. The successor of Aurelia CLI built-in bundler.'}

      // Pending implementation of conventions plugins for these bundlers.

      // Parcel can be done. But requires a dedicated repo (out of our mono repo) in order to write in commonjs format that Parcel wants.
      // https://github.com/parcel-bundler/parcel/issues/3256
      // Parcel v2 is also very near. Might wait for the new version.
      // {value: 'parcel', title: 'Parcel', hint: 'Blazing fast, zero configuration web application bundler.'},

      // Browserify has technical obstacle on TypeScript (tsify) https://github.com/TypeStrong/tsify/issues/34#issuecomment-514425682
      // There is no problem on babelify. But we will hold browserify for now.
      // {value: 'browserify', title: 'Browserify', hint: 'The bundler who started the business, a tool for compiling node-flavored commonjs modules for the browser.'},

      // FuseBox v4 is coming, and it's a total rewrite. Wait for it before implement.
      // {value: 'fuse-box', title: 'FuseBox', hint: 'A bundler that does it all, and does it right.'},
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
      {value: 'shadow-dom', title: 'Use Shadow DOM', hint: 'Shadow DOM in open mode, shadowRoot is accessible through DOM API.'},
      {value: 'css-module', title: 'Use CSS Module', hint: 'CSS Module is an alternative way to locally scope CSS class names.'},
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
      {value: 'jest', title: 'Jest', hint: 'Runs in Node.js, simulates browser by default, with a focus on simplicity.'},
      // Disable ava for now.
      // TODO: build some custom transformer to apply our conventions when running in nodejs env.
      // {value: 'ava', title: 'Ava + jsdom-global', hint: 'Runs in Node.js, simulates browser with jsdom-global. A test runner for Node.js with a concise API, detailed error output, embrace of new language features and process isolation that let you write tests more effectively.'},
      {value: 'jasmine', title: 'Jasmine', hint: 'Runs in browser, a behavior-driven testing framework.'},
      {value: 'mocha', title: 'Mocha + Chai', hint: 'Runs in browser, a feature-rich JavaScript test framework for node and browsers.'},
      {value: 'tape', title: 'Tape', hint: 'Runs in browser, tap-producing test harness for node and browsers.'}
    ]
  },
  {
    message: 'Do you want to setup e2e test?',
    choices: [
      {title: 'No'},
      {value: 'cypress', title: 'Yes (Cypress)', hint: 'Cypress offers fast, easy and reliable testing for anything that runs in a browser.'}
    ]
  },
  {
    message: 'What kind of sample code do you want in this project?',
    choices: [
      {value: 'app-min', title: 'Bare minimum'},
      {value: 'app-with-router', title: 'With direct routing'}
    ]
  },
  // Currently this question is not visible to end user because there is only one option.
  // Will expand the list in future, after Aurelia 2 offered IE11 compatible dist file.
  {
    message: 'What are your targeted browsers?',
    choices: [
      {value: 'browser-evergreen', title: 'All Evergreen browsers', hint: 'Including Chrome, Edge, Firefox, Safari'}
    ]
  }
];

if (process.env.CI) {
  // Add feature "ci" when running in CI environment.
  questions.push({
    message: '',
    choices: [
      {value: 'ci', title: 'Running in CI environment'}
    ]
  });
}

module.exports = questions;
