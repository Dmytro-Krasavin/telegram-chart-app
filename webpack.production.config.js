const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const conf = {

  entry: './src/js/index.js',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: '[hash]bundle.js'
  },

  devtool: false,

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc.json'
        }
      },
      {
        test: [/\.js$/, /.jsx?$/],
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true }
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'Departments',
      template: 'src/html/template.html'
    })
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          compress: true
        }
      })
    ]
  }

};

module.exports = conf;
