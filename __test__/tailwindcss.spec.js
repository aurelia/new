const test = require('ava');
const fs = require('fs');
const path = require('path');

test('TailwindCSS CSS template files exist', t => {
  const minAppCssPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.css__if_tailwindcss');
  const routerAppCssPath = path.join(__dirname, '..', 'app-with-router', 'src', 'my-app.css__if_tailwindcss');
  
  t.true(fs.existsSync(minAppCssPath), 'TailwindCSS CSS template should exist for minimal app');
  t.true(fs.existsSync(routerAppCssPath), 'TailwindCSS CSS template should exist for router app');
  
  const minCssContent = fs.readFileSync(minAppCssPath, 'utf8');
  const routerCssContent = fs.readFileSync(routerAppCssPath, 'utf8');
  
  t.true(minCssContent.includes('@import "tailwindcss"'), 'Minimal app CSS should use v4 import syntax');
  t.true(routerCssContent.includes('@import "tailwindcss"'), 'Router app CSS should use v4 import syntax');
  t.true(minCssContent.includes('.message'), 'Minimal app CSS should include message styles');
  t.true(routerCssContent.includes('nav'), 'Router app CSS should include navigation styles');
});

test('Parcel PostCSS config file exists for TailwindCSS', t => {
  const configPath = path.join(__dirname, '..', 'parcel', '.postcssrc__if_tailwindcss');
  t.true(fs.existsSync(configPath), 'Parcel PostCSS config should exist for TailwindCSS');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  t.true(configContent.includes('@tailwindcss/postcss'), 'Config should include TailwindCSS PostCSS plugin');
  
  // Verify it's valid JSON
  t.notThrows(() => JSON.parse(configContent), 'Config should be valid JSON');
});

test('Vite package.json includes TailwindCSS dependencies', t => {
  const packagePath = path.join(__dirname, '..', 'vite', 'package.json');
  t.true(fs.existsSync(packagePath), 'Vite package.json should exist');
  
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  t.true(packageContent.includes('"tailwindcss"'), 'Should include tailwindcss dependency');
  t.true(packageContent.includes('"@tailwindcss/vite"'), 'Should include @tailwindcss/vite dependency');
  t.true(packageContent.includes('4.1.10'), 'Should use latest TailwindCSS version');
});

test('Webpack package.json includes TailwindCSS dependencies', t => {
  const packagePath = path.join(__dirname, '..', 'webpack', 'package.json');
  t.true(fs.existsSync(packagePath), 'Webpack package.json should exist');
  
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  t.true(packageContent.includes('"tailwindcss"'), 'Should include tailwindcss dependency');
  t.true(packageContent.includes('"@tailwindcss/postcss"'), 'Should include @tailwindcss/postcss dependency');
  t.true(packageContent.includes('4.1.10'), 'Should use latest TailwindCSS version');
});

test('Dumber package.json includes TailwindCSS dependencies', t => {
  const packagePath = path.join(__dirname, '..', 'dumber', 'package.json');
  t.true(fs.existsSync(packagePath), 'Dumber package.json should exist');
  
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  t.true(packageContent.includes('"tailwindcss"'), 'Should include tailwindcss dependency');
  t.true(packageContent.includes('"@tailwindcss/postcss"'), 'Should include @tailwindcss/postcss dependency');
  t.true(packageContent.includes('4.1.10'), 'Should use latest TailwindCSS version');
});

test('Parcel package.json includes TailwindCSS dependencies', t => {
  const packagePath = path.join(__dirname, '..', 'parcel', 'package.json');
  t.true(fs.existsSync(packagePath), 'Parcel package.json should exist');
  
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  t.true(packageContent.includes('"tailwindcss"'), 'Should include tailwindcss dependency');
  t.true(packageContent.includes('"@tailwindcss/postcss"'), 'Should include @tailwindcss/postcss dependency');
  t.true(packageContent.includes('"postcss"'), 'Should include postcss dependency');
  t.true(packageContent.includes('"autoprefixer"'), 'Should include autoprefixer dependency');
  t.true(packageContent.includes('4.1.10'), 'Should use latest TailwindCSS version');
});

test('Vite config includes TailwindCSS plugin setup', t => {
  const configPath = path.join(__dirname, '..', 'vite', 'vite.config.ext');
  t.true(fs.existsSync(configPath), 'Vite config should exist');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  t.true(configContent.includes("import tailwindcss from '@tailwindcss/vite'"), 'Should import TailwindCSS Vite plugin');
  t.true(configContent.includes('tailwindcss()'), 'Should use TailwindCSS plugin in plugins array');
  t.true(configContent.includes('// @if tailwindcss'), 'Should use conditional logic');
});

test('Webpack config includes TailwindCSS PostCSS setup', t => {
  const configPath = path.join(__dirname, '..', 'webpack', 'webpack.config.js');
  t.true(fs.existsSync(configPath), 'Webpack config should exist');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  t.true(configContent.includes("'@tailwindcss/postcss'"), 'Should include TailwindCSS PostCSS plugin');
  t.true(configContent.includes('// @if tailwindcss'), 'Should use conditional logic');
});

test('Dumber gulpfile includes TailwindCSS PostCSS setup', t => {
  const gulpfilePath = path.join(__dirname, '..', 'dumber', 'gulpfile.js');
  t.true(fs.existsSync(gulpfilePath), 'Dumber gulpfile should exist');
  
  const gulpfileContent = fs.readFileSync(gulpfilePath, 'utf8');
  t.true(gulpfileContent.includes("require('@tailwindcss/postcss')"), 'Should require TailwindCSS PostCSS plugin');
  t.true(gulpfileContent.includes('// @if tailwindcss'), 'Should use conditional logic');
});

test('TailwindCSS styles use Aurelia conventions (no explicit import needed)', t => {
  const mainPath = path.join(__dirname, '..', 'common', 'src', 'main.ext__if_app');
  t.true(fs.existsSync(mainPath), 'Main entry file should exist');
  
  const minAppCssPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.css__if_tailwindcss');
  const routerAppCssPath = path.join(__dirname, '..', 'app-with-router', 'src', 'my-app.css__if_tailwindcss');
  t.true(fs.existsSync(minAppCssPath), 'TailwindCSS template should exist for minimal app');
  t.true(fs.existsSync(routerAppCssPath), 'TailwindCSS template should exist for router app');
  
  // Aurelia automatically imports CSS files with the same name as components
  // No explicit import statement needed for my-app.css
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  t.false(mainContent.includes("import './my-app.css'"), 'Should not need explicit import due to Aurelia conventions');
});

test('README includes TailwindCSS documentation', t => {
  const readmePath = path.join(__dirname, '..', 'common', 'README.md__skip-if-exists');
  t.true(fs.existsSync(readmePath), 'README template should exist');
  
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  t.true(readmeContent.includes('## TailwindCSS Integration'), 'Should have TailwindCSS section');
  t.true(readmeContent.includes('utility-first CSS styling'), 'Should describe TailwindCSS');
  t.true(readmeContent.includes('tailwind.config.js'), 'Should mention configuration');
  t.true(readmeContent.includes('// @if tailwindcss'), 'Should use conditional logic');
});

test('App templates include TailwindCSS styling when enabled', t => {
  const minAppPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.html');
  t.true(fs.existsSync(minAppPath), 'Minimal app template should exist');
  
  const minAppContent = fs.readFileSync(minAppPath, 'utf8');
  t.true(minAppContent.includes('<!-- @if tailwindcss -->'), 'Should have TailwindCSS conditional');
  t.true(minAppContent.includes('<!-- @if !tailwindcss -->'), 'Should have non-TailwindCSS conditional');
  t.true(minAppContent.includes('bg-gradient-to-br'), 'Should include TailwindCSS utility classes');
  t.true(minAppContent.includes('text-3xl font-bold'), 'Should include typography utilities');
});

test('Router app templates include TailwindCSS styling when enabled', t => {
  const routerAppPath = path.join(__dirname, '..', 'app-with-router', 'src', 'my-app.html');
  t.true(fs.existsSync(routerAppPath), 'Router app template should exist');
  
  const routerAppContent = fs.readFileSync(routerAppPath, 'utf8');
  t.true(routerAppContent.includes('<!-- @if tailwindcss -->'), 'Should have TailwindCSS conditional');
  t.true(routerAppContent.includes('bg-white shadow'), 'Should include TailwindCSS navigation styling');
  t.true(routerAppContent.includes('hover:border-indigo-500'), 'Should include hover effects');
  
  // Check welcome page
  const welcomePath = path.join(__dirname, '..', 'app-with-router', 'src', 'welcome-page.html');
  t.true(fs.existsSync(welcomePath), 'Welcome page template should exist');
  
  const welcomeContent = fs.readFileSync(welcomePath, 'utf8');
  t.true(welcomeContent.includes('bg-white rounded-lg shadow'), 'Should include card styling');
  t.true(welcomeContent.includes('grid grid-cols-1 md:grid-cols-2'), 'Should include responsive grid');
}); 