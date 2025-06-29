const test = require('ava');
const fs = require('fs');
const path = require('path');

test('Storybook configuration files exist', t => {
  // Check main config
  const mainPath = path.join(__dirname, '..', 'common', 'storybook-main.ext__if_storybook');
  t.true(fs.existsSync(mainPath), 'Storybook main config should exist');
  
  // Check preview config
  const previewPath = path.join(__dirname, '..', 'common', 'storybook-preview.ext__if_storybook');
  t.true(fs.existsSync(previewPath), 'Storybook preview config should exist');
  
  // Check README
  const readmePath = path.join(__dirname, '..', 'storybook__if_storybook', 'README.md');
  t.true(fs.existsSync(readmePath), 'Storybook README should exist');
});

test('Storybook configuration includes both Vite and Webpack setups', t => {
  const mainPath = path.join(__dirname, '..', 'common', 'storybook-main.ext__if_storybook');
  const content = fs.readFileSync(mainPath, 'utf8');
  
  t.true(content.includes('@aurelia/storybook'), 'Should use Aurelia Storybook framework');
  t.true(content.includes('@storybook/builder-vite'), 'Should use Vite builder');
  t.true(content.includes('@storybook/builder-webpack5'), 'Should use Webpack5 builder');
  t.true(content.includes('@storybook/addon-links'), 'Should include links addon');
  t.true(content.includes('viteFinal'), 'Should have viteFinal configuration');
  t.true(content.includes('@aurelia/runtime-html'), 'Should exclude Aurelia runtime from optimization');
  t.true(content.includes('/* @if vite */'), 'Should have Vite conditional');
  t.true(content.includes('/* @if webpack */'), 'Should have Webpack conditional');
});

test('Storybook Webpack configuration is included', t => {
  const mainPath = path.join(__dirname, '..', 'common', 'storybook-main.ext__if_storybook');
  const content = fs.readFileSync(mainPath, 'utf8');
  
  t.true(content.includes('docs: {}'), 'Should have docs configuration');
});

test('Storybook preview configuration is correct', t => {
  const previewPath = path.join(__dirname, '..', 'common', 'storybook-preview.ext__if_storybook');
  const content = fs.readFileSync(previewPath, 'utf8');
  
  t.true(content.includes("export { render, renderToCanvas } from '@aurelia/storybook'"), 
    'Should export render functions from Aurelia Storybook plugin');
});

test('Storybook story files exist and are properly structured', t => {
  // Check app-min story file
  const appMinStoryPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.stories.ext__if_storybook');
  t.true(fs.existsSync(appMinStoryPath), 'App-min story file should exist');
  
  const appMinContent = fs.readFileSync(appMinStoryPath, 'utf8');
  t.true(appMinContent.includes('/* @if vite */'), 'Should have Vite conditional');
  t.true(appMinContent.includes('/* @if webpack */'), 'Should have Webpack conditional');
  t.true(appMinContent.includes('import { MyApp }'), 'Should import MyApp component');
  
  // Check app-with-router story file
  const routerStoryPath = path.join(__dirname, '..', 'app-with-router', 'src', 'welcome-page.stories.ext__if_storybook');
  t.true(fs.existsSync(routerStoryPath), 'Router app story file should exist');
  
  // Check plugin story file
  const pluginStoryPath = path.join(__dirname, '..', 'plugin-min', 'src', 'hello-world.stories.ext__if_storybook');
  t.true(fs.existsSync(pluginStoryPath), 'Plugin story file should exist');
});

test('Vite package.json includes correct Storybook dependencies', t => {
  const vitePackagePath = path.join(__dirname, '..', 'vite', 'package.json');
  const content = fs.readFileSync(vitePackagePath, 'utf8');
  
  t.true(content.includes('"@aurelia/storybook": "^1.0.2"'), 'Should include Aurelia Storybook plugin v1.0.2');
  t.true(content.includes('"storybook": "^9.0.0"'), 'Should include Storybook 9');
  t.true(content.includes('"@storybook/builder-vite": "^9.0.0"'), 'Should include Vite builder');
  t.true(content.includes('"@storybook/addon-links": "^9.0.0"'), 'Should include links addon');
  t.true(content.includes('"@storybook/addon-actions": "^9.0.0"'), 'Should include actions addon');
  t.true(content.includes('"@storybook/test": "^9.0.0-alpha.2"'), 'Should include test utilities');
  
  // Check scripts
  t.true(content.includes('"storybook": "storybook dev -p 6006"'), 'Should include storybook dev script');
  t.true(content.includes('"build-storybook": "storybook build"'), 'Should include build script');
});

test('Webpack package.json includes correct Storybook dependencies', t => {
  const webpackPackagePath = path.join(__dirname, '..', 'webpack', 'package.json');
  const content = fs.readFileSync(webpackPackagePath, 'utf8');
  
  t.true(content.includes('"@aurelia/storybook": "^1.0.2"'), 'Should include Aurelia Storybook plugin v1.0.2');
  t.true(content.includes('"storybook": "^9.0.0"'), 'Should include Storybook 9');
  t.true(content.includes('"@storybook/builder-webpack5": "^9.0.0"'), 'Should include Webpack5 builder');
  t.true(content.includes('"@storybook/addon-links": "^9.0.0"'), 'Should include links addon');
  
  // Check scripts
  t.true(content.includes('"storybook": "storybook dev -p 6006"'), 'Should include storybook dev script');
  t.true(content.includes('"build-storybook": "storybook build"'), 'Should include build script');
});

test('Storybook README contains helpful information', t => {
  const readmePath = path.join(__dirname, '..', 'storybook__if_storybook', 'README.md');
  const content = fs.readFileSync(readmePath, 'utf8');
  
  t.true(content.includes('# Storybook Integration'), 'Should have main heading');
  t.true(content.includes('npm run storybook'), 'Should include dev command');
  t.true(content.includes('npm run build-storybook'), 'Should include build command');
  t.true(content.includes('http://localhost:6006'), 'Should mention default port');
  t.true(content.includes('.stories.ts'), 'Should explain story file naming');
  t.true(content.includes('Aurelia Storybook'), 'Should reference the plugin');
});

test('After task includes Storybook setup logic', t => {
  const afterPath = path.join(__dirname, '..', 'after.js');
  const content = fs.readFileSync(afterPath, 'utf8');
  
  t.true(content.includes("if (features.includes('storybook'))"), 'Should check for storybook feature');
  t.true(content.includes("fs.mkdirSync('.storybook')"), 'Should create .storybook directory');
  t.true(content.includes('storybook-main'), 'Should reference storybook-main file');
  t.true(content.includes('storybook-preview'), 'Should reference storybook-preview file');
  t.true(content.includes('.storybook/main'), 'Should move to .storybook/main');
  t.true(content.includes('.storybook/preview'), 'Should move to .storybook/preview');
}); 