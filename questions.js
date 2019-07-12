module.exports = [
  {
    message: 'Which bundler would you like to use?',
    choices: [
      {value: 'webpack', title: 'Webpack', hint: 'A powerful and popular bundler for modern JavaScript apps.'},
      {value: 'parcel', title: 'Parcel', hint: 'Blazing fast, zero configuration web application bundler.'},
      {value: 'browserify', title: 'Browserify', hint: 'The bundler who started the business, a tool for compiling node-flavored commonjs modules for the browser.'},
      {value: 'fuse-box', title: 'FuseBox', hint: 'A bundler that does it all, and does it right.'},
      {value: 'dumber', title: 'Dumber', hint: 'A dumb JavasScript bundler, dumber than you and me. The successor of Aurelia CLI built-in bundler.'}
    ]
  },
  {
    message: 'What transpiler would you like to use?',
    choices: [
      {value: 'babel', title: 'Babel', hint: 'An open source, standards-compliant ES2015 and ESNext transpiler.'},
      {value: 'typescript', message: 'TypeScript', hint: 'An open source, ESNext superset that adds optional strong typing.'}
    ]
  },
  {
    message: 'Do you want to setup e2e test?',
    choices: [
      {title: 'No'},
      {value: 'cypress', title: 'Yes (Cypress)', hint: 'Cypress offers fast, easy and reliable testing for anything that runs in a browser.'}
    ]
  },
  // This question is not raised to end user, since there is only one choice, it will be selected automatically.
  // We will add more sample code in future.
  {
    message: 'What kind of sample code do you want in this project?',
    choices: [
      {value: 'app-min', title: 'Bare minimum'}
    ]
  }
];
