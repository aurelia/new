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
    entry: test ? './test/all-spec.js' :  './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */',
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
        // @if !shadow-dom
        { test: /\.css$/i, use: [ "style-loader", cssLoader, postcssLoader ] },
        // @endif
        // @if shadow-dom
        { test: /\.css$/i, issuer: /\.(js|ts)$/, use: [ "to-string-loader", "style-loader", cssLoader, postcssLoader ] },
        { test: /\.css$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader ] },
        // @endif
        // @endif
        // @if less
        // @if !shadow-dom
        { test: /\.less$/i, use: [ "style-loader", cssLoader, postcssLoader, "less-loader" ] },
        // @endif
        // @if shadow-dom
        { test: /\.less$/i, issuer: /\.(js|ts)$/, use: [ "to-string-loader", "style-loader", cssLoader, postcssLoader, "less-loader" ] },
        { test: /\.less$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader, "less-loader" ] },
        // @endif
        // @endif
        // @if sass
        // @if !shadow-dom
        { test: /\.scss$/i, use: [ "style-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        // @endif
        // @if shadow-dom
        { test: /\.scss$/i, issuer: /\.(js|ts)$/, use: [ "to-string-loader", "style-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        { test: /\.scss$/i, issuer: /\.html$/, use: [ "to-string-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { sassOptions: { includePaths: ["node_modules"] } } } ] },
        // @endif
        // @endif
        // @if babel
        { test: /\.js$/i, use: ['babel-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if typescript
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if shadow-dom
        {
          test: /\.html$/i,
          use: {
            loader: '@aurelia/webpack-loader',
            options: {
              // The other possible Shadow DOM mode is "closed".
              // If you turn on "closed" mode, there will be difficulty to perform e2e
              // tests (such as Cypress). Because shadowRoot is not accessible through
              // standard DOM APIs in "closed" mode.
              defaultShadowOptions: { mode: 'open' }
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
        // @if !shadow-dom && !css-module
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
      test && runTest && new WebpackShellPluginNext({
        dev: false,
        swallowError: true,
        onBuildEnd: {
          scripts: [ 'npm run test:headless' ]
        }
      })/* @endif */
    ]/* @if jasmine || tape || mocha*/.filter(p => p)/* @endif */
  }
}
