const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
};

const conf = {

  entry: './src/js/index.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
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
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true
      },
      template: 'src/html/template.html'
    }),
    new UglifyJsPlugin(),
    new CleanWebpackPlugin()
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.js$/,
        parallel: true,
        uglifyOptions: {
          beautify: false,
          comments: false,
          compress: {
            sequences: true,
            booleans: true,
            loops: true,
            unused: true,
            warnings: false,
            drop_console: true,
            unsafe: true
          }
        }
      })
    ]
  }

};

module.exports = conf;
