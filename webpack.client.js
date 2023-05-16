const path = require("path");
const baseConfig = require('./webpack.base');
const { merge } = require("webpack-merge");

const config = {
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, "public"),
    filename: "client.js"
  }
};


module.exports = merge(baseConfig, config)
