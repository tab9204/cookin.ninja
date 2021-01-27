const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.json']
  },
  entry: {
        online: path.resolve(__dirname, 'src') + '/script.js',
        offline: path.resolve(__dirname, 'src') + '/offline.js',
    },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name]-bundle.js"
  },
  mode: 'development',
  devtool: 'inline-source-map'
}
