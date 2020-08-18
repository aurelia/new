const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
// @if jasmine || tape || mocha
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
// @endif

// @if !css-module
const cssLoader = 'css-loader';
// @endif
// @if css-module
const cssLoader = {
  loader: 'css-loader',
  options: {
    esModule: false,
    modules: true,
    // https://github.com/webpack-contrib/css-loader#importloaders
    importLoaders: /* @if css */1/* @endif *//* @if !css */2/* @endif */
  }
};
// @endif
// @if sass
const sassLoader = {
  loader: 'sass-loader',
  options: {
    sassOptions: {
      includePaths: ['node_modules']
    }
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

module.exports = function(env, { /* @if jasmine || tape || mocha*/runTest, /* @endif */analyze }) {
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
        { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
        { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
        { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
        { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
        // @if !shadow-dom
        { test: /\.css$/i, use: [ 'style-loader', cssLoader, postcssLoader ] },
        // @if less
        { test: /\.less$/i, use: [ 'style-loader', cssLoader, postcssLoader, 'less-loader' ] },
        // @endif
        // @if sass
        { test: /\.scss$/i, use: [ 'style-loader', cssLoader, postcssLoader, sassLoader ] },
        // @endif
        // @endif
        // @if shadow-dom
        {
          test: /\.css$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[\/\\]src[\/\\]main\.(js|ts)$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[\/\\]src[\/\\]main\.(js|ts)$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[\/\\]src[\/\\]main\.(js|ts)$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader, sassLoader ]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![\/\\]src[\/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', cssLoader, postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![\/\\]src[\/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', cssLoader, postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![\/\\]src[\/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', cssLoader, postcssLoader, sassLoader ]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'to-string-loader', cssLoader, postcssLoader, sassLoader ]
        },
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
              // The other possible Shadow DOM mode is 'closed'.
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
      new HtmlWebpackPlugin({ template: 'index.ejs' }),
      analyze && new BundleAnalyzerPlugin()/* @if jasmine || tape || mocha*/,
      test && runTest && new WebpackShellPluginNext({
        dev: false,
        swallowError: true,
        onBuildEnd: {
          scripts: [ 'npm run test:headless' ]
        }
      })/* @endif */
    ].filter(p => p)
  }
}
