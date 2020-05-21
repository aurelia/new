// check deps version in all skeleton package.json files
const fs = require('fs');
const readline = require('readline');
const glob = require('glob');
const ncu = require('npm-check-updates');
const files = glob.sync('*/package.json');
// const semver = require('semver')

let p = Promise.resolve();
for (let file of files) {
  p = p.then(() => checkFile(file));
}

async function checkFile(file) {
  console.log('\n' + file);

  const deps = {};

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(file, 'utf8'), // turn stream into lines
      crlfDelay: Infinity // be nice to Windows \r\n line break
    });

    rl.on('line', line => {
      // ignore empty line
      line = line.trim();
      if (!line) return;

      const m = line.match(/^\s*"([^"]+)":\s*"([^\w][^"]+)",?\s*$/);
      if (!m) return;

      if (m[2].match(/\d+\./)) deps[m[1]] = m[2];
    });

    rl.on('close', () => {
      ncu.run({packageData: JSON.stringify({dependencies: deps})})
      .then(
        upgrade => {
          console.log(upgrade);
          resolve();
        },
        // upgrade => {
        //   Object.keys(upgrade).forEach(name => {
        //     const version = upgrade[name];
        //     const major = semver.minVersion(version).major;
        //     if (major > semver.minVersion(deps[name]).major) {
        //       // Only highlight major upgrade
        //       console.log(`${name} ${deps[name]} ==> ^${major}.0.0 (latest is ${version})`);
        //     }
        //   });
        //   resolve();
        // },
        reject
      )
    });
  });
}
