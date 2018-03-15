const path = require('path');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const webpack= require('webpack');
const extractTextPlugin = require("extract-text-webpack-plugin");
const purifyCssPlugin = require('purifycss-webpack');
const glob = require('glob');

var website;
if(process.env.type== "dev"){
    website={
        publicPath:"http://cdn.jspang.com/"
    }
}else{
    website={
        publicPath:"http://127.0.0.1:9527/"
    }
}

module.exports = {
    //打包调试文件
    devtool:'eval-source-map',
    //入口文件配置
    entry:{
        entry:'./src/main.js',
        jquery:'jquery'
    },
    //出口文件的配置
    output: {
        //输出的文件的名称
        filename: 'bundle.js',
        //输出的路径，__dirname是项目的根路径，这里表示，将文件输出到项目根路径下的dist文件下
        path: path.resolve(__dirname,'dist'),
        //输出文件的路径，如http://127.0.0.1:9527/
        publicPath : website.publicPath
    },
    //模块：例如解读css,图片如何转换，压缩
    module:{
        rules:[
            {
                test:/\.css$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[
                        {loader:'css-loader',options:{ importLoaders: 1 }},
                        {loader:'postcss-loader'}
                    ]
                })
            },{
                test:/\.less$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }]
                })
            },{
                test:/\.scss$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            },{
                test:/\.(png|jpg|gif)$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:5000,//文件大小小于5000B的文件写成Base64
                        outputPath:'src/images/'//图片输出的位置
                    }
                }]
            },{
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader'
                },
                exclude:/node_modules/
            }
        ]
    },
    //插件，用于生产模板和各项功能
    plugins:[
        new webpack.BannerPlugin('author:weiwei'),//横幅
        new webpack.ProvidePlugin({//全局引用
            $:"jquery"
        }),
        new uglifyJsPlugin({
            sourceMap:true
        }),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        new extractTextPlugin('src/css/styles.css'),//css文件输出的位置
        new purifyCssPlugin({
            paths: glob.sync(path.join(__dirname,'src/*.html'))
        })
    ],
    //配置webpack开发服务器
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的ip地址
        host:'127.0.0.1',
        //服务端压缩是否开启
        compress:true,
        //服务器端口号
        port:9527
    },
    optimization : {
        splitChunks: {
          cacheGroups: {
            commons: {//
              chunks: 'initial',
              minChunks: 2, 
              maxInitialRequests: 5,
              minSize: 0
            },
            vendor: {//单独打包的外部插件
              test: /node_modules/,
              chunks: 'initial',
              name: 'jquery',
              filename:"assets/js/jquery.min.js",
              priority: 10,
              enforce: true
            }
          }
        },
        runtimeChunk : false//分块
    },
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    }
};