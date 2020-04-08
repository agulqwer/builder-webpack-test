const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

//mocha测试工具
const mocha = new Mocha({
    // 超时时间
    timeout: '10000ms'
});

//进入测试模板目录
process.chdir(path.resolve(__dirname, 'template'));

//删除dist构建目录，成功后进入回调函数
rimraf('./dist', () => {
    
    // 加载webpack配置文件
    const prodConfig = require('../../lib/webpack.prod.js');
   
    //webpack执行配置文件
    webpack(prodConfig, (err, stats) => {
        //出错，打印错误信息
      
        if (err) {
            console.log(err);
            process.exit(2);
        }
        //成功打印详细信息
        console.log(stats.toString({
            colors:true,
            modules:false,
            children: false
        }));

        console.log('webpack build success, begin run test');
        //添加测试文件
        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));

        // 运行
        mocha.run();
    });
});