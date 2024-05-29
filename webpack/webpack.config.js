// @if typescript
/* eslint-disable @typescript-eslint/no-var-requires */
// @endif
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
// @if jasmine || mocha
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
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

module.exports = function(env, { /* @if jasmine || mocha*/runTest, /* @endif */analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  // @if jasmine || mocha
  const test = env.test || process.env.NODE_ENV === 'test';
  // @endif
  return {
    target: 'web',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-source-map',
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // Terser fast minify mode
            // https://github.com/terser-js/terser#terser-fast-minify-mode
            // It's a good balance on size and speed to turn off compress.
            // Also bypass some terser bug.
            compress: false
          },
        }),
      ],
    },
    // @if jasmine || mocha
    entry: {
      entry: test ?
        './test/all-spec./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' :
        './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */'
    },
    // @endif
    // @if !jasmine && !mocha
    entry: {
      entry: './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */'
    },
    // @endif
    output: {
      clean: true,
      path: path.resolve(__dirname, 'dist'),
      filename: production ? '[name].[contenthash].bundle.js' : '[name].bundle.js'
    },
    resolve: {
      extensions: [/* @if typescript */'.ts', /* @endif */'.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: production ? {
        // add your production aliases here
      } : {
        ...getAureliaDevAliases()
        // add your development aliases here
      }
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
        { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,  type: 'asset' },
        // @if !shadow-dom
        { test: /\.css$/i, use: [ 'style-loader', 'css-loader', postcssLoader ] },
        // @if less
        { test: /\.less$/i, use: [ 'style-loader', 'css-loader', postcssLoader, 'less-loader' ] },
        // @endif
        // @if sass
        { test: /\.scss$/i, use: [ 'style-loader', 'css-loader', postcssLoader, sassLoader ] },
        // @endif
        // @endif
        // @if shadow-dom
        {
          test: /\.css$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [ 'css-loader', postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [ 'css-loader', postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [ 'css-loader', postcssLoader, sassLoader ]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', 'css-loader', postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', 'css-loader', postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', 'css-loader', postcssLoader, sassLoader ]
        },
        // @endif
        {
          test: /\.css$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'css-loader', postcssLoader ]
        },
        // @if less
        {
          test: /\.less$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'css-loader', postcssLoader, 'less-loader' ]
        },
        // @endif
        // @if sass
        {
          test: /\.scss$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ 'css-loader', postcssLoader, sassLoader ]
        },
        // @endif
        // @endif
        // @if babel
        { test: /\.js$/i, use: ['babel-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if typescript
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        {
          test: /[/\\]src[/\\].+\.html$/i,
          // @if shadow-dom
          use: {
            loader: '@aurelia/webpack-loader',
            options: {
              // The other possible Shadow DOM mode is 'closed'.
              // If you turn on "closed" mode, there will be difficulty to perform e2e
              // tests (such as Playwright). Because shadowRoot is not accessible through
              // standard DOM APIs in "closed" mode.
              defaultShadowOptions: { mode: 'open' }
            }
          },
          // @endif
          // @if !shadow-dom
          use: '@aurelia/webpack-loader',
          // @endif
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html', favicon: 'favicon.ico' }),
      new Dotenv({
        path: `./.env${production ? '' :  '.' + (process.env.NODE_ENV || 'development')}`,
      }),
      analyze && new BundleAnalyzerPlugin()/* @if jasmine || mocha*/,
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

function getAureliaDevAliases() {
  return [
    'aurelia',
    'fetch-client',
    'kernel',
    'metadata',
    'platform',
    'platform-browser',
    'route-recognizer',
    'router',
    'router-lite',
    'runtime',
    'runtime-html',
    'testing',
    'state',
    'ui-virtualization'
  ].reduce((map, pkg) => {
    const name = pkg === 'aurelia' ? pkg : `@aurelia/${pkg}`;
    try {
      const packageLocation = require.resolve(name);
      map[name] = path.resolve(packageLocation, `../../esm/index.dev.mjs`);
    } catch {/**/}
    return map;
  }, {});
}
