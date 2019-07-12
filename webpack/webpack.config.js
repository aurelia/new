const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env, { mode }) {
  const production = mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-maps' : 'eval',
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
