module.exports = [
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
    message: 'Do you want to use ShadowDOM?',
    choices: [
      {title: 'No'},
      {value: 'shadow-dom-open', title: 'ShadowDOM in open mode', hint: 'Open mode means that you can access the shadow DOM using JavaScript written in the main page context.'},
      {value: 'shadow-dom-closed', title: 'ShadowDOM in closed mode', hint: "Closed mode means that you won't be able to access the shadow DOM from the outside."},
    ]
  },
  {
    if: '!shadow-dom-open && !shadow-dom-closed',
    message: 'Do you want to use CSS Module?',
    choices: [
      {title: 'No'},
      {value: 'css-module', title: 'CSS Module is an alternative way to locally scope CSS class names. Do not use it together with ShadowDOM.'},
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
