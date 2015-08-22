var path = require("path");
var webpack = require("webpack");

module.exports = {
  target: "node",
  entry: {
    darkness: path.join(__dirname, "darkness.js"),
    bookmarklet: path.join(__dirname, "bookmarklet.js")
  },
  output: {
    path: __dirname,
    filename: "[name].min.js"
  },
  module: {
    loaders: [
      { test: /.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /.css$/, loader: "style!css" }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        },
        compress: {
            warnings: false
        }
    })
  ]
}
