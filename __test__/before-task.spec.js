const test = require('ava');
const before = require('../before');

test('"before" task does nothing in unattended mode', async t => {
  const prompts = {
    select() {
      t.fail('should not call me');
    }
  };

  const result = await before({unattended: true, prompts});
  t.is(result, undefined);
});

test('"before" task can select default-esnext preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-esnext'));
      return 'default-esnext';
    }
  };

  const result = await before({unattended: false, prompts});
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'vite', 'babel', 'vitest']
  });
});

test('"before" task can select default-typescript preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-typescript'));
      return new Promise(resolve => {
        setTimeout(() => resolve('default-typescript'), 10);
      });
    }
  };

  const result = await before({unattended: false, prompts});
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'vite', 'typescript', 'vitest']
  });
});

test('"before" task can select default-esnext-dumber preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-esnext-dumber'));
      return 'default-esnext-dumber';
    }
  };

  const result = await before({ unattended: false, prompts });
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'dumber', 'babel']
  });
});

test('"before" task can select default-typescript-dumber preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-typescript-dumber'));
      return new Promise(resolve => {
        setTimeout(() => resolve('default-typescript-dumber'), 10);
      });
    }
  };

  const result = await before({ unattended: false, prompts });
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'dumber', 'typescript']
  });
});
test('"before" task can select no preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === undefined));
      return new Promise(resolve => {
        setTimeout(() => resolve(), 10);
      });
    }
  };

  const result = await before({unattended: false, prompts});
  t.is(result, undefined);
});

