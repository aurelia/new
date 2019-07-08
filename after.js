// Use "after" task to ask user to install deps.

const {execSync} = require('child_process');

function isAvailable(bin) {
  try {
    execSync(bin + ' -v')
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async function({
  unattended, here, prompts, run, properties, features, notDefaultFeatures, ansiColors
}) {
  const c = ansiColors;
  let depsInstalled = false;

  if (!unattended) {
    const choices = [
      {title: 'No'},
      {value: 'npm', title: 'Yes, use npm'}
    ];

    if (isAvailable('yarn')) {
      choices.push({value: 'yarn', title: 'Yes, use yarn'});
    }

    // if (isAvailable('pnpm')) {
    //   choices.push({value: 'pnpm', title: 'Yes, use pnpm'});
    // }

    const result = await prompts.select({
      message: 'Do you want to install npm dependencies now?',
      choices
    });

    if (result) {
      await run(result, ['install']);
      depsInstalled = true;
    }

    console.log(`\nNext time, you can try to create similar project in silent mode:`);
    console.log(c.inverse(` npx makes aurelia new-project-name${here ? ' --here' : ''} -s ${notDefaultFeatures.length ? (notDefaultFeatures.join(',') + ' ') : ''}`));
  }

  console.log(`\n${c.underline.bold('Get Started')}`);
  if (!here) console.log('cd ' + properties.name);
  if (!depsInstalled) console.log('npm install');
  console.log('npm start\n');
};
