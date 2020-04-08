const path = require('path');
const glob = require('glob');
// 补齐css前缀
const autoprefixer = require('autoprefixer');
// 提取css独立文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 清理目录插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 配置入口文件，引入js，css外部资源
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 错误友好提示插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 定义根目录
const projectRoot = process.cwd();
// 配置多入口
// 定义函数，返回entry和HtmlWebpackPlugin
const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];

  // 获取入口文件
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  
  // 获取入口文件模块名
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // 通过正则获取入口名
    const match = entryFile.match(/src\/(.*)\/index.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    // 设置html-webpack-plugin插件配置
    return HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
      // html模板所在的路径
      template: path.join(projectRoot, `./src/${pageName}/index.html`),
      // 输出html的文件名称
      filename: `${pageName}.html`,
      // 配置多入口，对应output中多入口的name值
      chunks: [pageName],
      /**
             * true：默认值，script标签位于html文件的body底部
             * body：script标签位于html文件的body底部(同true)
             * head；script标签位于head标签内
             * false：不插入生成的js文件，只是单纯的生成一个html文件
             */
      inject: true,
      // 压缩html文件
      minify: {
        html5: true,
        // 删除空白符和换行符
        collapseWhitespace: true,
        // 移除HTML中的注释
        preserveLineBreaks: false,
        // 压缩内联CSS
        minifyCSS: true,
        // 压缩内联JS
        minifyJS: true,
        // 去除HTML中的注释
        removeComments: false,
      },
    }));
  });
  
  // 返回参数
  return {
    entry,
    HtmlWebpackPlugins,
  };
};

// 获取多入口配置参数
const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(projectRoot, "dist"),
    filename: "[name]_[chunkhash:8].js"
  },
  module: {
    rules: [
      // js解析
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      // css解析
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 将css提取为独立的文件
          'css-loader',
        ],
      },
      // less文件解析成css
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // 将css提取为独立文件
          'css-loader',
          {
            // postCss，css预处理工具
            loader: 'postcss-loader',
            options: {
              plugins() {
                autoprefixer({
                  // 添加前缀规则，数据来源于www.caniuse.com
                  // 主流浏览器最近2个版本，全球统计有超过1%的使用率，ios7系统
                  browsers: ['last 2 version', '>1%', 'ios7'],
                });
              },
            },
          },
          // px转为 rem，结合lib-flexible使用
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem=75像素，假设设计稿为750px，结合lib-flexible的方案，这里设置成了设计稿的1/10，默认值75
              remPrecision: 8, // px转rem的精度,rem小数点后的位数
            },
          },
          'less-loader',
        ],
      },
      // 图片处理
      {
        test: /\.(png|svg|jpeg|gif|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, // 单位字节，对于小于10k的图片转换为base64
              name: '[name]_[hash:8].[ext]', // 文件名包含哈希值
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // css独立文件提取插件
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // 清理构建目录
    new CleanWebpackPlugin(),
    // webpack错误友好提示插件
    new FriendlyErrorsWebpackPlugin(),
    // webpack错误捕获
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          // 自定义出错误处理
          console.log("打包错误信息：", stats.compilation.errors);
          // 抛出错误
          process.exit(1);
        }
      });
    },
  ].concat(HtmlWebpackPlugins),
  // webpack统计信息--stats--
  stats: 'errors-only', // 只在发生错误的时候输出
};
