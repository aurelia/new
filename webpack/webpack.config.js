const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env, { mode }) {
  const production = mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    // @if babel
    entry: './src/main.js',
    // @endif
    // @if typescript
    entry: './src/main.ts',
    // @endif
    devtool: false,
    resolve: {
      // @if babel
      extensions: ['.js'],
      // @endif
      // @if typescript
      extensions: ['.ts', '.js'],
      // @endif
      modules: ['src', 'node_modules'],
    },
    devServer: {
      port: 9000,
      historyApiFallback: true,
      open: true,
      lazy: false
    },
    module: {
      rules: [
        { test: /\.css$/i, use: ["style-loader", "css-loader"] },
        // @if babel
        { test: /\.js$/i, loader: 'babel-loader' },
        // @endif
        // @if typescript
        { test: /\.ts$/i, loader: 'ts-loader' },
        // @endif
        { test: /\.html$/i, loader: 'html-loader' }
      ]
    },
    plugins: [new HtmlWebpackPlugin({ template: 'index.ejs' })]
  }
}
