#!/usr/bin/env node

const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  AURELIA_PACKAGE_VERSIONS,
  TEMPLATE_PROPERTY_BY_PACKAGE,
} = require('../aurelia-versions');

const shouldWrite = process.argv.includes('--write');

function npmViewVersion(pkg) {
  const version = execFileSync('npm', ['view', pkg, 'version', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
  return JSON.parse(version);
}

function formatObject(name, values) {
  const lines = Object.entries(values).map(([key, value]) => `  '${key}': '${value}',`);
  return `const ${name} = {\n${lines.join('\n')}\n};`;
}

function writeVersionsFile(versions) {
  const content = [
    formatObject('AURELIA_PACKAGE_VERSIONS', versions),
    '',
    formatObject('TEMPLATE_PROPERTY_BY_PACKAGE', TEMPLATE_PROPERTY_BY_PACKAGE),
    '',
    'const TEMPLATE_PROPERTIES = Object.entries(TEMPLATE_PROPERTY_BY_PACKAGE)',
    '  .reduce((properties, [pkg, property]) => {',
    '    properties[property] = AURELIA_PACKAGE_VERSIONS[pkg];',
    '    return properties;',
    '  }, {});',
    '',
    'module.exports = {',
    '  AURELIA_PACKAGE_VERSIONS,',
    '  TEMPLATE_PROPERTY_BY_PACKAGE,',
    '  TEMPLATE_PROPERTIES,',
    '};',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(__dirname, '..', 'aurelia-versions.js'), content);
}

const publishedVersions = {};
const mismatches = [];

for (const [pkg, expectedVersion] of Object.entries(AURELIA_PACKAGE_VERSIONS)) {
  const publishedVersion = npmViewVersion(pkg);
  publishedVersions[pkg] = publishedVersion;

  if (publishedVersion !== expectedVersion) {
    mismatches.push({pkg, expectedVersion, publishedVersion});
  }
}

if (shouldWrite) {
  writeVersionsFile(publishedVersions);
  console.log('Updated aurelia-versions.js from npm published versions.');
  process.exit(0);
}

if (mismatches.length > 0) {
  console.error('Aurelia scaffold versions are not aligned with npm published versions:');
  for (const {pkg, expectedVersion, publishedVersion} of mismatches) {
    console.error(`- ${pkg}: scaffold has ${expectedVersion}, npm has ${publishedVersion}`);
  }
  console.error('\nRun `npm run update-aurelia-versions` before releasing this scaffold.');
  process.exit(1);
}

console.log('Aurelia scaffold versions match npm published versions.');
