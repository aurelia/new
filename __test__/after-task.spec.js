const test = require('ava');
const after = require('../after');

const ansiColors = (m) => m;
ansiColors.inverse = ansiColors;
ansiColors.underline = ansiColors;
ansiColors.bold = ansiColors;

const isAvailable = bin => bin === 'yarn';

test('"after" task only prints summary in unattended mode', async t => {
  const prompts = {
    select() {
      t.fail('should not call me');
    }
  };

  function run(cmd, args) {
    t.fail('should not call me');
  }

  let printOut = '';
  await after({
    unattended: true,
    here: false,
    prompts,
    run,
    properties: {name: 'app'},
    notDefaultFeatures: ['a', 'b-c'],
    ansiColors
  }, {
    _isAvailable: isAvailable,
    _log(m) {
      printOut += m + '\n';
    }
  });

  t.is(printOut,
    '\nGet Started\n' +
    'cd app\n' +
    'npm install\n' +
    'npm start\n\n'
  );
});

test('"after" task only prints summary in unattended mode and here mode', async t => {
  const prompts = {
    select() {
      t.fail('should not call me');
    }
  };

  function run(cmd, args) {
    t.fail('should not call me');
  }

  let printOut = '';
  await after({
    unattended: true,
    here: true,
    prompts,
    run,
    properties: {name: 'app'},
    notDefaultFeatures: ['a', 'b-c'],
    ansiColors
  }, {
    _isAvailable: isAvailable,
    _log(m) {
      printOut += m + '\n';
    }
  });

  t.is(printOut,
    '\nGet Started\n' +
    'npm install\n' +
    'npm start\n\n'
  );
});

test('"after" task installs deps, and prints summary', async t => {
  const prompts = {
    select(opts) {
      t.deepEqual(opts.choices.map(c => c.value), [undefined, 'npm', 'yarn']);
      return 'yarn';
    }
  };

  function run(cmd, args) {
    t.is(cmd, 'yarn');
    t.deepEqual(args, ['install']);
  }

  let printOut = '';
  await after({
    unattended: false,
    here: false,
    prompts,
    run,
    properties: {name: 'app'},
    notDefaultFeatures: ['a', 'b-c'],
    ansiColors
  }, {
    _isAvailable: isAvailable,
    _log(m) {
      printOut += m + '\n';
    }
  });

  t.is(printOut,
    '\nNext time, you can try to create similar project in silent mode:\n' +
    ' npx makes aurelia new-project-name -s a,b-c \n\n' +
    'Get Started\n' +
    'cd app\n' +
    'npm start\n\n'
  );
});

test('"after" task installs deps, and prints summary in here mode', async t => {
  const prompts = {
    select(opts) {
      t.deepEqual(opts.choices.map(c => c.value), [undefined, 'npm']);
      return 'npm';
    }
  };

  function run(cmd, args) {
    t.is(cmd, 'npm');
    t.deepEqual(args, ['install']);
  }

  let printOut = '';
  await after({
    unattended: false,
    here: true,
    prompts,
    run,
    properties: {name: 'app'},
    notDefaultFeatures: ['a', 'b-c'],
    ansiColors
  }, {
    _isAvailable: () => false,
    _log(m) {
      printOut += m + '\n';
    }
  });

  t.is(printOut,
    '\nNext time, you can try to create similar project in silent mode:\n' +
    ' npx makes aurelia new-project-name --here -s a,b-c \n\n' +
    'Get Started\n' +
    'npm start\n\n'
  );
});
