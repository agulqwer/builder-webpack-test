// 合并插件
const merge = require('webpack-merge');
// 引入基础配置
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');
// css压缩插件

// 自定义生产环境配置
const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        // 忽略css
        test: /\.css$/,
        use: 'ignore-loader',
      },
      {
        // 忽略less
        test: /\.less$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    // css文件压缩配置
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),

  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

// 合并配置文件
module.exports = merge(baseConfig, prodConfig);
