/**
 * Created by 2087 on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const entrys = require('./config/entry-web2.config');
const devConfig = require('./src/sz-web2/config/devConfig');

module.exports = {
    devtool: 'eval-source-map',
    entry:entrys,
    output:{
        filename: 'js/[name].js',
        path: path.join(__dirname, './dev-bundle/'),
    },
    externals: {
        'jquery': 'window.jQuery',
        'angular': 'window.angular',
        'echarts': 'window.echarts',
        'BMap':'window.BMap'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader", `less-loader?{modifyVars:${JSON.stringify({ mainColor:'#1089ff' })}}`]
            })
        },{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, './src')
        },{
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'images/[name].[ext]',
                    publicPath:devConfig.filePath2
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name].[ext]',
                    publicPath:devConfig.filePath2
                }
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        historyApiFallback: true,
        host: 'localhost',
        port: devConfig.filePath2.split(':').pop().split('/')[0]
    },
    plugins:[
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks:2
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks:true
        }),
        new webpack.DefinePlugin({
            PRODUCTION:JSON.stringify('dev')
        })
    ]
};