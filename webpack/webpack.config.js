const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = function(env) {
  const production = env === 'production' || process.env.NODE_ENV === 'production';
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-maps' : 'inline-source-map',
    // @if babel
    entry: './src/main.js',
    // @endif
    // @if typescript
    entry: './src/main.ts',
    // @endif
    resolve: {
      // @if babel
      extensions: ['.js'],
      // @endif
      // @if typescript
      extensions: ['.ts', '.js'],
      // @endif
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
        { test: /\.css$/i, use: [ "style-loader", cssLoader, postcssLoader ] },
        // @endif
        // @if less
        { test: /\.less$/i, use: [ "style-loader", cssLoader, postcssLoader, "less-loader" ] },
        // @endif
        // @if sass
        { test: /\.scss$/i, use: [ "style-loader", cssLoader, postcssLoader, { loader: "sass-loader", options: { includePaths: ["node_modules"] } } ] },
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
    plugins: [new HtmlWebpackPlugin({ template: 'index.ejs' })]
  }
}
