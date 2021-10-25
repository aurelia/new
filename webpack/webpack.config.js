// @if typescript
/* eslint-disable @typescript-eslint/no-var-requires */
// @endif
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
// @if jasmine || tape || mocha
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
// @endif
// @if tape
const { ProvidePlugin } = require('webpack');
// @endif
// @if plugin
const nodeExternals = require('webpack-node-externals');
// @endif

// @if !css-module
const cssLoader = 'css-loader';
// @endif
// @if css-module
const cssLoader = {
  loader: 'css-loader',
  options: {
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
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = function (env, { /* @if jasmine || tape || mocha*/runTest, /* @endif */analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  // @if jasmine || tape || mocha
  const test = env.test || process.env.NODE_ENV === 'test';
  // @endif
  return {
    // @if app
    target: 'web',
    // @endif
    // @if plugin
    target: production ? 'node' : 'web',
    // @endif
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-source-map',
    // @if jasmine || tape || mocha
    entry: {
      entry: test ?
        './test/all-spec./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' :
        // @if app
        './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */'
          // @endif
          // @if plugin
          // Build only plugin in production mode,
          // build dev-app in non-production mode
          (production ? './src/index./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' : './dev-app/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */')
      // @endif
    },
    // @endif
    // @if !jasmine && !tape && !mocha
    entry: {
      // @if app
      entry: './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */'
      // @endif
      // @if plugin
      // Build only plugin in production mode,
      // build dev-app in non-production mode
      entry: production ? './src/index./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' : './dev-app/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */'
      // @endif
    },
    // @endif
    output: {
      path: path.resolve(__dirname, 'dist'),
      // @if app
      filename: production ? '[name].[contenthash].bundle.js' : '[name].bundle.js'
      // @endif
      // @if plugin
      filename: production ? 'index.js' : '[name].bundle.js',
      library: production ? { type: 'commonjs' } : undefined
      // @endif
    },
    resolve: {
      // @if tape
      fallback: {
        // webpack 5 uses resolve.fallback for nodejs core module stubs.
        fs: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer')
      },
      // @endif
      extensions: [/* @if typescript */'.ts', /* @endif */'.js'],
      modules: [path.resolve(__dirname, 'src'),/* @if !production */ path.resolve(__dirname, 'dev-app'),/* @endif */ 'node_modules']
    },
    // @if tape
    node: {
      global: true,
      __dirname: true,
      __filename: true
    },
    // @endif
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
        { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset' },
        // @if !shadow-dom
        { test: /\.css$/i, use: ['style-loader', cssLoader, postcssLoader] },
        // @if less
        { test: /\.less$/i, use: ['style-loader', cssLoader, postcssLoader, 'less-loader'] },
        // @endif
        // @if sass
        { test: /\.scss$/i, use: ['style-loader', cssLoader, postcssLoader, sassLoader] },
        // @endif
        // @endif
        // @if shadow-dom
        {
          test: /\.css$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [cssLoader, postcssLoader]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [cssLoader, postcssLoader, 'less-loader']
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [cssLoader, postcssLoader, sassLoader]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: ['style-loader', cssLoader, postcssLoader]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: ['style-loader', cssLoader, postcssLoader, 'less-loader']
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: ['style-loader', cssLoader, postcssLoader, sassLoader]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [cssLoader, postcssLoader]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [cssLoader, postcssLoader, 'less-loader']
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [cssLoader, postcssLoader, sassLoader]
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
          // @if app
          test: /[/\\]src[/\\].+\.html$/i,
          // @endif
          // @if plugin
          test: /[/\\](?:src|dev-app)[/\\].+\.html$/i,
          // @endif
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
          // @if app
          test: /[/\\]src[/\\].+\.html$/i,
          // @endif
          // @if plugin
          test: /[/\\](?:src|dev-app)[/\\].+\.html$/i,
          // @endif
          use: {
            loader: '@aurelia/webpack-loader',
            options: { useCSSModule: true }
          },
          exclude: /node_modules/
        }
        // @endif
        // @if !shadow-dom && !css-module
        {
          // @if app
          test: /[/\\]src[/\\].+\.html$/i,
          // @endif
          // @if plugin
          test: /[/\\](?:src|dev-app)[/\\].+\.html$/i,
          // @endif
          use: '@aurelia/webpack-loader',
          exclude: /node_modules/
        }
        // @endif
      ]
    },
    // @if plugin
    externalsPresets: { node: production },
    externals: [
      // Skip npm dependencies in plugin build.
      production && nodeExternals()
    ].filter(p => p),
    // @endif
    plugins: [
      // @if tape
      new ProvidePlugin({
        process: 'process/browser'
      }),
      // @endif
      /* @if plugin */!production && /* @endif */new HtmlWebpackPlugin({ template: 'index.html' }),
      new Dotenv({
        path: `./.env${production ? '' : '.' + process.env.NODE_ENV}`,
      }),
      // Makes some environment variables available (overtop the file ones)
      new webpack.EnvironmentPlugin(process.env),
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      analyze && new BundleAnalyzerPlugin()/* @if jasmine || tape || mocha*/,
      test && runTest && new WebpackShellPluginNext({
        dev: false,
        swallowError: true,
        onBuildEnd: {
          scripts: ['npm run test:headless']
        }
      })/* @endif */
    ].filter(p => p)
  }
}
