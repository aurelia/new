const test = require('ava');
const fs = require('fs');
const path = require('path');

// Test bundler-specific TailwindCSS integration patterns
test('TailwindCSS integrates properly with each supported bundler', t => {
  const bundlers = ['vite', 'webpack', 'dumber', 'parcel'];
  
  bundlers.forEach(bundler => {
    const bundlerDir = path.join(__dirname, '..', bundler);
    t.true(fs.existsSync(bundlerDir), `${bundler} directory should exist`);
    
    const packageJsonPath = path.join(bundlerDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
      
      if (bundler === 'vite') {
        t.true(packageContent.includes('@tailwindcss/vite'), `${bundler} should use Vite plugin`);
      } else {
        t.true(packageContent.includes('@tailwindcss/postcss'), `${bundler} should use PostCSS plugin`);
      }
    }
  });
});

test('TailwindCSS configuration follows v4 patterns', t => {
  // Test Vite config uses v4 plugin approach
  const viteConfigPath = path.join(__dirname, '..', 'vite', 'vite.config.ext');
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  t.true(viteConfig.includes("import tailwindcss from '@tailwindcss/vite'"), 'Should use v4 Vite plugin import');
  t.false(viteConfig.includes('tailwind.config.js'), 'Should not reference old config file approach');
  
  // Test CSS uses v4 import syntax
  const cssPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.css__if_tailwindcss');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  t.true(cssContent.includes('@import "tailwindcss"'), 'Should use v4 import syntax');
  t.false(cssContent.includes('@tailwind base'), 'Should not use v3 directive syntax');
  t.false(cssContent.includes('@tailwind components'), 'Should not use v3 directive syntax');
  t.false(cssContent.includes('@tailwind utilities'), 'Should not use v3 directive syntax');
});

test('TailwindCSS templates use modern utility classes', t => {
  const minAppPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.html');
  const minAppContent = fs.readFileSync(minAppPath, 'utf8');
  
  // Test for modern v4 features
  t.true(minAppContent.includes('bg-gradient-to-br'), 'Should use gradient utilities');
  t.true(minAppContent.includes('from-blue-50'), 'Should use color palette');
  t.true(minAppContent.includes('shadow-lg'), 'Should use shadow utilities');
  t.true(minAppContent.includes('rounded-lg'), 'Should use border radius utilities');
  
  // Test responsive design
  t.true(minAppContent.includes('max-w-md'), 'Should use responsive max-width');
  
  // Test modern color system (ensure it's compatible with v4)
  t.true(minAppContent.includes('text-gray-'), 'Should use gray color scale');
  t.true(minAppContent.includes('bg-blue-'), 'Should use blue color scale');
});

test('TailwindCSS works with all CSS preprocessor combinations', t => {
  // TailwindCSS should work regardless of CSS preprocessor choice
  const questions = require('../questions');
  
  const tailwindQuestion = questions.find(q => q.message && q.message.includes('TailwindCSS'));
  const cssQuestion = questions.find(q => q.message && q.message.includes('CSS preprocessor'));
  
  t.truthy(tailwindQuestion, 'TailwindCSS question should exist');
  t.truthy(cssQuestion, 'CSS preprocessor question should exist');
  
  // TailwindCSS should be independent of CSS preprocessor choice
  t.is(tailwindQuestion.choices.length, 2, 'TailwindCSS should have yes/no options');
  t.true(cssQuestion.choices.some(choice => choice.value === 'css'), 'Should support plain CSS');
  t.true(cssQuestion.choices.some(choice => choice.value === 'sass'), 'Should support Sass');
});

test('TailwindCSS documentation is comprehensive', t => {
  const readmePath = path.join(__dirname, '..', 'common', 'README.md__skip-if-exists');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Check for essential documentation sections
  t.true(readmeContent.includes('## TailwindCSS Integration'), 'Should have main section');
  t.true(readmeContent.includes('### Using TailwindCSS'), 'Should have usage section');
  t.true(readmeContent.includes('### Customizing TailwindCSS'), 'Should have customization section');
  t.true(readmeContent.includes('### TailwindCSS Resources'), 'Should have resources section');
  
  // Check for practical examples
  t.true(readmeContent.includes('max-w-md mx-auto'), 'Should include practical example');
  t.true(readmeContent.includes('tailwind.config.js'), 'Should show config example');
  t.true(readmeContent.includes('https://tailwindcss.com/docs'), 'Should link to official docs');
});

test('TailwindCSS feature is properly isolated', t => {
  // Ensure TailwindCSS doesn't affect non-TailwindCSS projects
  const minAppPath = path.join(__dirname, '..', 'app-min', 'src', 'my-app.html');
  const minAppContent = fs.readFileSync(minAppPath, 'utf8');
  
  // Should have both conditional branches
  t.true(minAppContent.includes('<!-- @if tailwindcss -->'), 'Should have TailwindCSS conditional');
  t.true(minAppContent.includes('<!-- @if !tailwindcss -->'), 'Should have non-TailwindCSS conditional');
  
  // Non-TailwindCSS version should be simple
  const nonTailwindMatch = minAppContent.match(/<!-- @if !tailwindcss -->([\s\S]*?)<!-- @endif -->/);
  t.truthy(nonTailwindMatch, 'Should have non-TailwindCSS content');
  t.true(nonTailwindMatch[1].includes('class="message"'), 'Non-TailwindCSS should use simple class');
});

test('TailwindCSS version consistency across all bundlers', t => {
  const bundlers = ['vite', 'webpack', 'dumber', 'parcel'];
  const expectedVersion = '4.1.10';
  
  bundlers.forEach(bundler => {
    const packagePath = path.join(__dirname, '..', bundler, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      
      if (packageContent.includes('tailwindcss')) {
        t.true(packageContent.includes(expectedVersion), 
          `${bundler} should use TailwindCSS version ${expectedVersion}`);
      }
    }
  });
});

test('TailwindCSS conditional logic is consistent', t => {
  const filesToCheck = [
    'vite/vite.config.ext',
    'webpack/webpack.config.js', 
    'dumber/gulpfile.js',
    'common/src/main.ext__if_app',
    'app-min/src/my-app.html',
    'common/README.md__skip-if-exists',
    'parcel/.postcssrc__if_tailwindcss'
  ];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('tailwindcss')) {
        // JSON files use __if_tailwindcss suffix instead of inline comments
        const isJsonFile = filePath.endsWith('.postcssrc__if_tailwindcss');
        const hasConditionalLogic = content.includes('// @if tailwindcss') || 
                                   content.includes('<!-- @if tailwindcss -->') ||
                                   isJsonFile;
        t.true(hasConditionalLogic, 
          `${filePath} should use conditional logic for TailwindCSS`);
      }
    }
  });
});

test('TailwindCSS does not conflict with existing features', t => {
  // Test that TailwindCSS can be combined with other features
  const mainPath = path.join(__dirname, '..', 'common', 'src', 'main.ext__if_app');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  
  // Should handle multiple conditional features
  t.true(mainContent.includes('// @if'), 'Should use conditional logic');
  t.true(mainContent.includes('// @endif'), 'Should close conditional blocks');
  
      // TailwindCSS uses Aurelia conventions - no explicit import needed
    t.false(mainContent.includes("import './my-app.css'"), 'TailwindCSS should not need explicit import due to Aurelia conventions');
}); 