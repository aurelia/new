import test from 'ava';
import questions from '../questions';

// This test does nothing but make sure questions.js can be loaded.
test('questions array can be loaded', t => {
  t.true(Array.isArray(questions));
});
