const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env, { mode }) {
  const production = mode === 'production';
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
      modules: ['src', 'node_modules']
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
      lazy: false
    },
    module: {
      rules: [
        // @if !css-module
        { test: /\.css$/i, use: ["style-loader", "css-loader"] },
        // @endif
        // @if css-module
        { test: /\.css$/i, use: ["style-loader", { loader: "css-loader", options: { modules: true } }] },
        // @endif
        // @if babel
        { test: /\.js$/i, use: ['babel-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if typescript
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        // @endif
        // @if shadow-dom-open
        { test: /\.html$/i, use: { loader: '@aurelia/webpack-loader', options: { defaultShadowOptions: { mode: 'open' } } }, exclude: /node_modules/ }
        // @endif
        // @if shadow-dom-closed
        { test: /\.html$/i, use: { loader: '@aurelia/webpack-loader', options: { defaultShadowOptions: { mode: 'closed' } } }, exclude: /node_modules/ }
        // @endif
        // @if css-module
        { test: /\.html$/i, use: { loader: '@aurelia/webpack-loader', options: { useCSSModule: true } }, exclude: /node_modules/ }
        // @endif
        // @if !shadow-dom-open && !shadow-dom-closed && !css-module
        { test: /\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ }
        // @endif
      ]
    },
    plugins: [new HtmlWebpackPlugin({ template: 'index.ejs' })]
  }
}
