const test = require('ava');
const {
  AURELIA_PACKAGE_VERSIONS,
  TEMPLATE_PROPERTY_BY_PACKAGE,
  TEMPLATE_PROPERTIES,
} = require('../aurelia-versions');

test('Aurelia package versions expose template properties', t => {
  for (const [pkg, property] of Object.entries(TEMPLATE_PROPERTY_BY_PACKAGE)) {
    t.truthy(AURELIA_PACKAGE_VERSIONS[pkg]);
    t.is(TEMPLATE_PROPERTIES[property], AURELIA_PACKAGE_VERSIONS[pkg]);
  }
});

test('Aurelia package versions are exact pins', t => {
  for (const version of Object.values(AURELIA_PACKAGE_VERSIONS)) {
    t.false(version === 'latest');
    t.false(version === 'dev');
    t.false(/^[~^]/.test(version));
  }
});
