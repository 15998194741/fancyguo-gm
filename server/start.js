process.env.gmconfig = JSON.stringify({
    pghost:'127.0.0.1',
    serverip:'106.75.7.83'
});
require('@babel/register');
require('@babel/polyfill');

// 这个是引入启动文件
require('./src/index');