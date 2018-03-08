const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const website = {publicPath:"http://127.0.0.1:9527/"}

module.exports = {
    //入口文件配置
    entry: "./src/main.js",
    //出口文件的配置
    output: {
        //输出的文件的名称
        filename: 'bundle.js',
        //输出的路径，__dirname是项目的根路径，这里表示，将文件输出到项目根路径下的dist文件下
        path: path.resolve(__dirname,'dist'),
        publicPath : website.publicPath
    },
    //模块：例如解读css,图片如何转换，压缩
    module:{
        rules:[
            {
                test:/\.css$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use:'css-loader'
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
                test:/\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:5000,//文件大小小于5000B的文件写成Base64
                        outputPath:'src/images/'//图片输出的位置
                    }
                }]
            }
        ]
    },
    //插件，用于生产模板和各项功能
    plugins:[
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        new extractTextPlugin('src/css/styles.css')//css文件输出的位置
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
    }
};