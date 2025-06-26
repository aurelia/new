// @if typescript
/* eslint-disable @typescript-eslint/no-var-requires */
// @endif
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
// @if plugin
const nodeExternals = require('webpack-node-externals');
// @endif

const cssLoader = {
  loader: 'css-loader'/* @if css-module */,
  options: {
    modules: {
      // css-loader v7 changed namedExport to follow esModule (true).
      // But we need to set it to false in order to have consistent
      // behaviour for vite/parcel/webpack skeletons.
      namedExport: false
    }
  }/* @endif */
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        // @if tailwindcss
        '@tailwindcss/postcss',
        // @endif
        'autoprefixer'
      ]
    }
  }
};

module.exports = function(env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    // @if app
    target: 'web',
    // @endif
    // @if plugin
    target: production ? 'node' : 'web',
    // @endif
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
    entry: {
      // @if app
      entry: './src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */',
      // @endif
      // @if plugin
      // Build only plugin in production mode,
      // build dev-app in non-production mode
      entry:  production? './src/index./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */' : './dev-app/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */',
      // @endif
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, 'dist'),
      // @if app
      filename: production ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
      // @endif
      // @if plugin
      filename: production ? 'index.js' : '[name].bundle.js',
      library: production ? { type: 'commonjs' } : undefined,
      // @endif
    },
    resolve: {
      extensions: [/* @if typescript */'.ts', /* @endif */'.js'],
      modules: [path.resolve(__dirname, 'src'),/* @if plugin */ path.resolve(__dirname, 'dev-app'),/* @endif */ 'node_modules'],
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
        { test: /\.css$/i, use: [ 'style-loader', cssLoader, postcssLoader ] },
        // @endif
        // @if shadow-dom
        {
          test: /\.css$/i,
          // For style loaded in src/main.js, it's not loaded by style-loader.
          // It's for shared styles for shadow-dom only.
          issuer: /[/\\]src[/\\]main\.(js|ts)$/,
          use: [ cssLoader, postcssLoader ]
        },
        {
          test: /\.css$/i,
          // For style loaded in other js/ts files, it's loaded by style-loader.
          // They are directly injected to HTML head.
          issuer: /(?<![/\\]src[/\\]main)\.(js|ts)$/,
          use: [ 'style-loader', cssLoader, postcssLoader ]
        },
        {
          test: /\.css$/i,
          // For style loaded in html files, Aurelia will handle it.
          issuer: /\.html$/,
          use: [ cssLoader, postcssLoader ]
        },
        // @endif
        // @if babel
        { test: /\.js$/i, use: ['babel-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if typescript
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        {
          // @if app
          test: /[/\\]src[/\\].+\.html$/i,
          // @endif
          // @if plugin
          test: /[/\\](?:src|dev-app)[/\\].+\.html$/i,
          // @endif
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
    // @if plugin
    externalsPresets: { node: production },
    externals: [
      // Skip npm dependencies in plugin build.
      production && nodeExternals()
    ].filter(p => p),
    // @endif
    plugins: [
      /* @if plugin */!production && /* @endif */new HtmlWebpackPlugin({ template: 'index.html', favicon: 'favicon.ico' }),
      new Dotenv({
        path: `./.env${production ? '' :  '.' + (process.env.NODE_ENV || 'development')}`,
      }),
      analyze && new BundleAnalyzerPlugin()
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
