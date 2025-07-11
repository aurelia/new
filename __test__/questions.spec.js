const test = require('ava');
const questions = require('../questions');

// This test does nothing but make sure questions.js can be loaded.
test('questions array can be loaded', t => {
  t.true(Array.isArray(questions));
});

test('TailwindCSS question is properly included', t => {
  const tailwindQuestion = questions.find(q => 
    q.message && q.message.includes('TailwindCSS')
  );
  
  t.truthy(tailwindQuestion, 'TailwindCSS question should exist');
  t.is(tailwindQuestion.message, 'Do you want to use TailwindCSS?');
  t.true(Array.isArray(tailwindQuestion.choices), 'TailwindCSS question should have choices');
  t.is(tailwindQuestion.choices.length, 2, 'TailwindCSS question should have 2 choices');
  
  // Check "No" option
  const noChoice = tailwindQuestion.choices[0];
  t.is(noChoice.title, 'No');
  t.is(noChoice.value, undefined);
  
  // Check "Yes" option
  const yesChoice = tailwindQuestion.choices[1];
  t.is(yesChoice.value, 'tailwindcss');
  t.is(yesChoice.title, 'Yes');
  t.truthy(yesChoice.hint);
  t.true(yesChoice.hint.includes('utility-first'));
});

test('TailwindCSS question comes after CSS preprocessor question', t => {
  const cssQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('CSS preprocessor')
  );
  const tailwindQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('TailwindCSS')
  );
  
  t.true(cssQuestionIndex >= 0, 'CSS preprocessor question should exist');
  t.true(tailwindQuestionIndex >= 0, 'TailwindCSS question should exist');
  t.true(tailwindQuestionIndex > cssQuestionIndex, 'TailwindCSS question should come after CSS preprocessor question');
});

test('TailwindCSS question comes before unit testing question', t => {
  const tailwindQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('TailwindCSS')
  );
  const testingQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('unit testing')
  );
  
  t.true(tailwindQuestionIndex >= 0, 'TailwindCSS question should exist');
  t.true(testingQuestionIndex >= 0, 'Unit testing question should exist');
  t.true(tailwindQuestionIndex < testingQuestionIndex, 'TailwindCSS question should come before unit testing question');
});

test('Storybook question is properly included', t => {
  const storybookQuestion = questions.find(q => 
    q.message && q.message.includes('Storybook')
  );
  
  t.truthy(storybookQuestion, 'Storybook question should exist');
  t.is(storybookQuestion.message, 'Do you want to add Storybook?');
  t.true(Array.isArray(storybookQuestion.choices), 'Storybook question should have choices');
  t.is(storybookQuestion.choices.length, 2, 'Storybook question should have 2 choices');
  
  // Check "No" option
  const noChoice = storybookQuestion.choices[0];
  t.is(noChoice.title, 'No');
  t.is(noChoice.value, undefined);
  
  // Check "Yes" option
  const yesChoice = storybookQuestion.choices[1];
  t.is(yesChoice.value, 'storybook');
  t.is(yesChoice.title, 'Yes');
  t.truthy(yesChoice.hint);
  t.true(yesChoice.hint.includes('Vite or Webpack'));
  t.truthy(yesChoice.if);
  t.is(yesChoice.if, '(app && (vite || webpack)) || (plugin && webpack)');
});

test('Storybook question comes after e2e testing question', t => {
  const e2eQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('e2e test')
  );
  const storybookQuestionIndex = questions.findIndex(q => 
    q.message && q.message.includes('Storybook')
  );
  
  t.true(e2eQuestionIndex >= 0, 'E2E testing question should exist');
  t.true(storybookQuestionIndex >= 0, 'Storybook question should exist');
  t.true(storybookQuestionIndex > e2eQuestionIndex, 'Storybook question should come after e2e testing question');
});
