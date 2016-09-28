var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var isProd = (process.env.NODE_ENV === 'production');

var config = {
  entry: APP_DIR + (isProd ? '/index.jsx' : '/demo.jsx'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: "/static/"
  },
  externals: isProd ? {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-dom/server': 'ReactDOMServer',
    'react/lib/ReactTransitionGroup': 'React.addons.TransitionGroup',
    'react/lib/ReactCSSTransitionGroup': 'React.addons.CSSTransitionGroup'
  } : {},
  module : {
    loaders : [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel",
        include: APP_DIR,
        query: {
          presets: isProd ? [ 'es2016', 'react'] : [ 'es2015', 'react', 'react-hmre' ],
          plugins: ["syntax-decorators"]
        }
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  }
};

module.exports = config;