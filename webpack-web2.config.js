/**
 * Created by 2087 on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const entrys = require('./config/entry-web2.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./create/lib/filePath').web2;

module.exports = {
    entry:entrys,
    output:{
        filename: 'js/[name]-[chunkhash].js',
        path: config.output.static,
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
                use: ["css-loader?minimize", "postcss-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader?minimize",
                    "postcss-loader",
                    `less-loader?{modifyVars:${JSON.stringify({ mainColor:'#1089ff' })}}`
                ]
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
                    name:'images/[name]-[hash].[ext]',
                    publicPath:'/static2/'
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name]-[hash].[ext]',
                    publicPath:'/static2/'
                }
            }]
        }]
    },
    plugins:[
        new CleanWebpackPlugin([
            path.join(config.output.static, 'js/*.js'),
            path.join(config.output.static, 'css/*.css'),
            path.join(config.output.static, 'images/*.*'),
            path.join(config.output.static, 'font/*.*')
        ],{
            root: path.join(__dirname, '../'),
            verbose: true
        }),
        new UglifyJSPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename:'js/[name]-[chunkhash].js',
            minChunks:2
        }),
        new ExtractTextPlugin({
            filename: 'css/[name]-[chunkhash].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            PRODUCTION:JSON.stringify('prod')
        })
    ]
};