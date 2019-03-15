const HtmlWebpackPlugin = require('html-webpack-plugin');

const conf = {

  entry: './src/js/index.js',

  devServer: {
    overlay: true
  },

  devtool: 'eval-sourcemap',

  module: {
    rules: [
      {
        test: [/\.js$/, /.jsx?$/],
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Departments',
      template: 'src/html/template.html'
    })
  ]
};

module.exports = conf;
