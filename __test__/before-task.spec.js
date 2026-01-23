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

test('"before" task can select minimal-esnext preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'minimal-esnext'));
      return 'minimal-esnext';
    }
  };

  const result = await before({unattended: false, prompts});
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'vite', 'babel', 'no-unit-tests', 'app-blank', 'css']
  });
});

test('"before" task can select minimal-typescript preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'minimal-typescript'));
      return 'minimal-typescript';
    }
  };

  const result = await before({unattended: false, prompts});
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'vite', 'typescript', 'no-unit-tests', 'app-blank', 'css']
  });
});

test('"before" task can select lean-modern-frontend preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'lean-modern-frontend'));
      return 'lean-modern-frontend';
    }
  };

  const result = await before({unattended: false, prompts});
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['app', 'vite', 'typescript', 'vitest', 'tailwindcss', 'storybook', 'app-min']
  });
});
test('"before" task can select default-esnext-plugin preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-esnext-plugin'));
      return 'default-esnext-plugin';
    }
  };

  const result = await before({ unattended: false, prompts });
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['plugin', 'vite', 'babel', 'shadow-dom', 'vitest']
  });
});

test('"before" task can select default-typescript-plugin preset', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'default-typescript-plugin'));
      return new Promise(resolve => {
        setTimeout(() => resolve('default-typescript-plugin'), 10);
      });
    }
  };

  const result = await before({ unattended: false, prompts });
  t.deepEqual(result, {
    silentQuestions: true,
    preselectedFeatures: ['plugin', 'vite', 'typescript', 'shadow-dom', 'vitest']
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
