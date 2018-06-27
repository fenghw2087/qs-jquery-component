/**
 * Created by 2087 on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const entrys = require('./config/entry-demo.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PackDemoHtml = require('./plugins/packDemoHtml');

module.exports = {
    entry:entrys,
    output:{
        filename: 'js/[name]-[chunkhash].js',
        path: path.join(__dirname, './src/demo/public/'),
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
                use: [ "css-loader?importLoaders=2", "postcss-loader","less-loader" ]
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
                    publicPath:'/'
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name].[ext]',
                    publicPath:'/'
                }
            }]
        }]
    },
    plugins:[
        new PackDemoHtml({
            mode:'prod',
            config:path.join(__dirname,'./src/demo/config/chunkConfig')
        }),
        new CleanWebpackPlugin([
            path.join(__dirname, './src/demo/public/js/*.js'),
            path.join(__dirname, './src/demo/public/css/*.css'),
            path.join(__dirname, './src/demo/public/images/*.*'),
            path.join(__dirname, './src/demo/public/font/*.*')
        ]),
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