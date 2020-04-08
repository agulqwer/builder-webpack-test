// 合并文件插件
const merge = require('webpack-merge');
// 引入webpack
const webpack = require('webpack');
// 引入webpack基础配置文件
const baseConfig = require('./webpack.base');

// 定义开发环境配置
const devConfig = {
  mode: 'development',
  plugins: [
    // 配置热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
  // 热更新配置
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
  },
  // sourcemap配置
  devtool: 'cheap-source-map',
};

// 合并配置
module.exports = merge(baseConfig, devConfig);
