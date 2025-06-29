## Clear tracing cache

In rare situation, you might need to run clear-cache after upgrading to new version of dumber bundler.

    npm run clear-cache

## index.html

`index.html` is generated from `_index.html` every time `npm run build` runs. It is handled by dumber's `onManifest()` option, check `gulpfile.js` for details.

## Shadow DOM and Shared Styles

The dumber/gulp setup supports Shadow DOM shared styles using dumber's built-in text loader.

### Usage

Import CSS files directly to load them as strings for shadow DOM:

```javascript
// In src/main.js
import shared from './shared.css';
import Aurelia, { StyleConfiguration } from 'aurelia';

Aurelia
  .register(StyleConfiguration.shadowDOM({
    // Add the shared styles for all components
    sharedStyles: [shared]
  }))
  .app(MyApp)
  .start();
```

### How it works

- Dumber automatically treats CSS files as text modules, so no special prefix is needed
- The CSS files are processed through the normal gulp pipeline (including Sass compilation, PostCSS and asset inlining) before being wrapped as text modules
- When imported, CSS files return their content as strings, perfect for Shadow DOM shared styles
- The `injectCss: false` option can disable automatic injection of CSS files if you prefer to handle them manually

## Bundle size

In production mode, both JS and CSS will be minified and optimized.
