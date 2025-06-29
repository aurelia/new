## src/index.html

By Parcel2 conventions, the `index.html` is in `src/` folder.

## Aurelia 2 config

To control the behaviour of ShadownDOM in Aurelia 2, create a section `"aurelia"` in the `package.json` file.
https://www.npmjs.com/package/@aurelia/parcel-transformer

## Shadow DOM and Shared Styles

When using Shadow DOM with Aurelia 2, you can share CSS styles across all shadow-rendered components using `StyleConfiguration.shadowDOM({ sharedStyles: [...] })`.

### Usage

To import CSS as a string for shared styles, use the `bundle-text:` scheme:

```javascript
// In src/main.js or src/main.ts
import shared from 'bundle-text:./shared.css';
import Aurelia, { StyleConfiguration } from 'aurelia';

Aurelia
  .register(StyleConfiguration.shadowDOM({
    // optionally add the shared styles for all components
    sharedStyles: [shared]
  }))
  .app(MyApp)
  .start();
```

The `bundle-text:` scheme tells Parcel to compile the CSS file (including Sass, PostCSS, etc.) and return the result as a plain text string instead of injecting it into the document.

### How it works

- CSS files imported with `bundle-text:` are fully processed through Parcel's CSS pipeline
- The compiled result is returned as a string that can be used with `StyleConfiguration.shadowDOM({ sharedStyles: [...] })`
- The styles will be available to all components rendered with Shadow DOM
- Regular CSS imports (without `bundle-text:`) still work normally and are injected into the document head

### Bundle inlining

This feature uses Parcel's [bundle inlining](https://parceljs.org/features/bundle-inlining/) capabilities. Other inlining schemes like `data-url:` are also available for different use cases.
