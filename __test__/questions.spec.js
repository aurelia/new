const test = require('ava');
const {possibleFeatureSelections} = require('makes');
const questions = require('../questions');

test('questionnaire does not ask for Aurelia release tags', t => {
  t.false(questions.some(question =>
    question.message === 'What Aurelia 2 release would you like to use?'
  ));
});

test('questionnaire can opt out of app dev server', t => {
  const selections = possibleFeatureSelections(questions);

  t.true(selections.some(features =>
    features.includes('app') &&
    features.includes('vite') &&
    features.includes('no-dev-server')
  ));
});

test('questionnaire does not offer Playwright without a dev server', t => {
  const selections = possibleFeatureSelections(questions);

  t.false(selections.some(features =>
    features.includes('no-dev-server') &&
    features.includes('playwright')
  ));
});

test('dev server opt-out is only offered for app projects', t => {
  const selections = possibleFeatureSelections(questions);

  t.false(selections.some(features =>
    features.includes('plugin') &&
    features.includes('no-dev-server')
  ));
});
