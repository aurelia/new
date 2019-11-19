const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// @if jasmine || tape || mocha
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
// @endif

// @if !css-module
const cssLoader = "css-loader";
// @endif
// @if css-module
const cssLoader = {
  loader: "css-loader",
  options: {
    modules: true,
    // https://github.com/webpack-contrib/css-loader#importloaders
    importLoaders: /* @if css */1/* @endif *//* @if !css */2/* @endif */
  }
};
// @endif

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      require('autoprefixer')()
    ]
  }
};

module.exports = function(env/* @if jasmine || tape || mocha*/, { runTest }/* @endif */) {
  const production = env === 'production' || process.env.NODE_ENV === 'production';
  // @if jasmine || tape || mocha
  const test = env === 'test' || process.env.NODE_ENV === 'test';
  // @endif
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-maps' : 'inline-source-map',
    // @if jasmine || tape || mocha
    entry: test ? './test/all-spec./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' :  './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */',
    // @endif
    // @if !jasmine && !tape && !mocha
    entry: './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */',
    // @endif
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'entry-bundle.js'
    },
    resolve: {
      extensions: [/* @if typescript */'.ts', /* @endif */'.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
      lazy: false
    },
    module: {
      rules: [
        // @if css
        // @if !shadow-dom-open && !shadow-dom-closed
        { test: /\.css$/i, use: [ "style-loader", cssLoader, postcssLoader ] },
        // @endif
        // @if shadow-dom-open || shadow-dom-closed
        { test: /\.css$/i, issuer: /\.(js|ts)$/, use: [ "style-loader", cssLoader, postcssLoader ] },
        { test: /\.css$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader ] },
        // @endif
        // @endif
        // @if less
        // @if !shadow-dom-open && !shadow-dom-closed
        { test: /\.less$/i, use: [ "style-loader", cssLoader, postcssLoader, "less-loader" ] },
        // @endif
        // @if shadow-dom-open || shadow-dom-closed
        { test: /\.less$/i, issuer: /\.(js|ts)$/, use: [ "style-loader", cssLoader, postcssLoader, "less-loader" ] },
        { test: /\.less$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader, "less-loader" ] },
        // @endif
        // @endif
        // @if sass
        // @if !shadow-dom-open && !shadow-dom-closed
        { test: /\.scss$/i, use: [ "style-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        // @endif
        // @if shadow-dom-open || shadow-dom-closed
        { test: /\.scss$/i, issuer: /\.(js|ts)$/, use: [ "style-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        { test: /\.scss$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        // @endif
        // @endif
        // @if babel
        { test: /\.js$/i, use: ['babel-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if typescript
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if shadow-dom-open
        {
          test: /\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: {
              defaultShadowOptions: { mode: 'open' }
            }
          },
          exclude: /node_modules/
        }
        // @endif
        // @if shadow-dom-closed
        {
          test: /\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: {
              defaultShadowOptions: {
                // Only use 'closed' mode in production build.
                // 'open' mode is needed for running tests.
                mode: production ? 'closed' : 'open'
              }
            }
          },
          exclude: /node_modules/
        }
        // @endif
        // @if css-module
        {
          test: /\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: { useCSSModule: true }
          },
          exclude: /node_modules/
        }
        // @endif
        // @if !shadow-dom-open && !shadow-dom-closed && !css-module
        { test: /\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ }
        // @endif
      ]
    },
    // @if tape
    node: {
      fs: 'empty',
    },
    // @endif
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.ejs' })/* @if jasmine || tape || mocha*/,
      test && runTest && new WebpackShellPluginNext({ onBuildEnd: [ 'npm run test:headless' ]})/* @endif */
    ]/* @if jasmine || tape || mocha*/.filter(p => p)/* @endif */
  }
}
