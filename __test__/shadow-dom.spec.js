const test = require('ava');
const fs = require('fs');
const path = require('path');

test('Shadow DOM template files include bundler-specific conditional comments', t => {
  // Check main app template
  const mainAppPath = path.join(__dirname, '..', 'common', 'src', 'main.ext__if_app');
  t.true(fs.existsSync(mainAppPath), 'Main app template should exist');
  
  const mainAppContent = fs.readFileSync(mainAppPath, 'utf8');
  
  // Check that shadow-dom conditional wrapper exists
  t.true(mainAppContent.includes('// @if shadow-dom'), 'Should have shadow-dom conditional wrapper');
  
  // Check bundler-specific conditionals
  t.true(mainAppContent.includes('// @if webpack'), 'Should have webpack conditional');
  t.true(mainAppContent.includes('// @if vite'), 'Should have vite conditional');
  t.true(mainAppContent.includes('// @if parcel'), 'Should have parcel conditional');
  t.true(mainAppContent.includes('// @if dumber'), 'Should have dumber conditional');
});

test('Shadow DOM plugin template includes Shadow DOM conditionals for dev-app', t => {
  // Check plugin template - plugin dev-apps can optionally use Shadow DOM for testing
  const pluginMainPath = path.join(__dirname, '..', 'plugin-min', 'dev-app', 'main.ext');
  t.true(fs.existsSync(pluginMainPath), 'Plugin main template should exist');
  
  const pluginMainContent = fs.readFileSync(pluginMainPath, 'utf8');
  
  // Plugin dev-apps can have shadow-dom conditionals for testing purposes
  t.true(pluginMainContent.includes('// @if shadow-dom'), 'Plugin dev-app should have shadow-dom conditionals');
  t.true(pluginMainContent.includes('StyleConfiguration'), 'Plugin dev-app should conditionally import StyleConfiguration');
  t.true(pluginMainContent.includes('sharedStyles'), 'Plugin dev-app should conditionally configure sharedStyles');
});

test('Shadow DOM templates include correct import patterns for each bundler', t => {
  const mainAppPath = path.join(__dirname, '..', 'common', 'src', 'main.ext__if_app');
  const mainAppContent = fs.readFileSync(mainAppPath, 'utf8');
  
  // Check webpack import (no special syntax)
  t.true(mainAppContent.includes("import shared from './shared."), 'Should have webpack import pattern');
  
  // Check vite import with ?inline
  t.true(mainAppContent.includes("import shared from './shared.") && 
         mainAppContent.includes('?inline'), 'Should have vite ?inline import pattern');
  
  // Check parcel import with bundle-text: scheme
  t.true(mainAppContent.includes("import shared from 'bundle-text:./shared."), 'Should have parcel bundle-text import pattern');
  
  // Check dumber import (same as webpack, but with explanation)
  const dumberSection = mainAppContent.match(/\/\/ @if dumber[\s\S]*?\/\/ @endif/);
  t.truthy(dumberSection, 'Should have dumber section');
  t.true(dumberSection[0].includes('CSS files are automatically treated as text modules'), 'Should explain dumber CSS handling');
});

test('Shadow DOM templates include StyleConfiguration import and usage', t => {
  const filesToCheck = [
    'common/src/main.ext__if_app',
    'plugin-min/dev-app/main.ext'
  ];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check StyleConfiguration import
    t.true(content.includes('StyleConfiguration'), 'Should import StyleConfiguration when shadow-dom is enabled');
    
    // Check StyleConfiguration.shadowDOM usage
    t.true(content.includes('StyleConfiguration.shadowDOM'), 'Should use StyleConfiguration.shadowDOM');
    t.true(content.includes('sharedStyles: [shared]'), 'Should configure sharedStyles with imported CSS');
  });
});

test('Shadow DOM conditional logic is consistent across templates', t => {
  const filesToCheck = [
    'common/src/main.ext__if_app',
    'plugin-min/dev-app/main.ext'
  ];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Count @if shadow-dom and @endif to ensure they're balanced
    const ifCount = (content.match(/\/\/ @if shadow-dom/g) || []).length;
    const endifCount = (content.match(/\/\/ @endif/g) || []).length;
    
    // Should have balanced conditional blocks
    t.true(ifCount > 0, `${filePath} should have shadow-dom conditionals`);
    t.true(endifCount >= ifCount, `${filePath} should have balanced @if/@endif blocks`);
  });
});

test('Shadow DOM documentation comments explain bundler differences', t => {
  const mainAppPath = path.join(__dirname, '..', 'common', 'src', 'main.ext__if_app');
  const content = fs.readFileSync(mainAppPath, 'utf8');
  
  // Check webpack explanation
  t.true(content.includes('Css files imported in this main file are NOT processed by style-loader'), 
    'Should explain webpack behavior');
  
  // Check vite explanation
  t.true(content.includes('Css files imported in this main file should be imported with ?inline query'), 
    'Should explain vite ?inline requirement');
  
  // Check parcel explanation
  t.true(content.includes('Css files imported in this main file should use bundle-text: scheme'), 
    'Should explain parcel bundle-text scheme');
  
  // Check dumber explanation
  t.true(content.includes('CSS files are automatically treated as text modules in dumber'), 
    'Should explain dumber automatic handling');
});

test('Shadow DOM shared CSS files exist for apps', t => {
  const sharedCssFiles = [
    'app-min/src/shared.css__if_css_and_shadow-dom',
    'app-min/src/shared.scss__if_sass_and_shadow-dom',
    'app-with-router/src/shared.css__if_css_and_shadow-dom',
    'app-with-router/src/shared.scss__if_sass_and_shadow-dom'
  ];
  
  sharedCssFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    t.true(fs.existsSync(fullPath), `${filePath} should exist`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    t.true(content.includes('.shared-shadow-style'), `${filePath} should include .shared-shadow-style`);
    t.true(content.includes('.shared-shadow-text'), `${filePath} should include .shared-shadow-text`);
    t.true(content.includes('gradient'), `${filePath} should include gradient styles`);
    t.true(content.includes('box-shadow'), `${filePath} should include box-shadow`);
  });
});

test('Shadow DOM HTML templates include showcase elements (apps only)', t => {
  const htmlFiles = [
    'app-min/src/my-app.html'
  ];
  
  htmlFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Should have shadow-dom conditionals
    t.true(content.includes('<!-- @if shadow-dom -->'), `${filePath} should have shadow-dom conditional`);
    t.true(content.includes('<!-- @endif -->'), `${filePath} should close shadow-dom conditional`);
    
    // Should reference shared shadow styles
    t.true(content.includes('shared-shadow-style') || content.includes('shared-shadow-text'), 
      `${filePath} should reference shared shadow DOM classes`);
  });
});

test('Plugin source templates do not include Shadow DOM elements', t => {
  const pluginSrcFiles = [
    'plugin-min/src/hello-world.html'
  ];
  
  pluginSrcFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Plugin source components should NOT have shadow-dom conditionals
    t.false(content.includes('<!-- @if shadow-dom -->'), `${filePath} should NOT have shadow-dom conditionals`);
    t.false(content.includes('shared-shadow-style'), `${filePath} should NOT reference shared shadow styles`);
  });
});

test('Shadow DOM SCSS files use Sass variables and functions', t => {
  const scssFiles = [
    'app-min/src/shared.scss__if_sass_and_shadow-dom',
    'app-with-router/src/shared.scss__if_sass_and_shadow-dom'
  ];
  
  scssFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Should use Sass variables
    t.true(content.includes('$'), `${filePath} should use Sass variables`);
    
    // Should use Sass functions (calc)
    t.true(content.includes('calc(') || content.includes('rgba('), 
      `${filePath} should use Sass functions`);
  });
}); 