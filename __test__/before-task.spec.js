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
    preselectedFeatures: ['app', 'vite', 'babel', 'vitest', 'css']
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
    preselectedFeatures: ['app', 'vite', 'typescript', 'vitest', 'css']
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
    preselectedFeatures: ['plugin', 'webpack', 'babel', 'shadow-dom', 'jest', 'css']
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
    preselectedFeatures: ['plugin', 'webpack', 'typescript', 'shadow-dom', 'jest', 'css']
  });
});

test('"before" task returns css as default feature for custom project', async t => {
  const prompts = {
    select(opts) {
      t.truthy(opts.choices.find(c => c.value === 'custom'));
      return 'custom'; // Select custom project
    }
  };

  const result = await before({ unattended: false, prompts });
  t.deepEqual(result, {
    preselectedFeatures: ['css']
  });
});
test('"before" task returns undefined when no selection is made', async t => {
  const prompts = {
    select(opts) {
      // Verify all choices have values now
      t.true(opts.choices.every(c => c.value !== undefined));
      return new Promise(resolve => {
        setTimeout(() => resolve(), 10); // Return undefined (no selection)
      });
    }
  };

  const result = await before({unattended: false, prompts});
  t.is(result, undefined);
});

