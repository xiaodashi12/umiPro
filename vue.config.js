
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
    return path.join(__dirname,'.', dir);
}

module.exports = {
    baseUrl : '/',
    publicPath : '/',
    chainWebpack: config => {
        config.resolve.alias
        .set('@', resolve('src'))
        .set('@assets',resolve('src/assets'))
        .set('styles',resolve('src/styles'))
        .set('@utils',resolve('src/utils'))
        .set('@views',resolve('src/views'))
    },
    devServer:{
        // 设置代理
        // before: require('./src/mock'),
        proxy: {
            "/manager": {
                // target: "http://172.18.61.4:10022", // 正式地址的base_url
                // target: "http://172.18.205.4:10021",// 测试地址的base_url
                target: "http://192.168.10.203:10025", // 本地地址的base_url
                ws: true, // 是否启用websockets
                changOrigin: true //开启代理
            },
        }
        
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [new BundleAnalyzerPlugin()]
            }
        }
    }
}