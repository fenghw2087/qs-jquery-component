/**
 * Created by 2087 on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const entrys = require('./config/entry-demo.config');
const devConfig = require('./src/demo/config/chunkConfig').devConfig;
const PackDemoHtml = require('./plugins/packDemoHtml');

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
                use: ["css-loader?importLoaders=1", "postcss-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [ "css-loader", "postcss-loader",`less-loader?{modifyVars:${JSON.stringify({ mainColor:'#1890ff' })}}` ]
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
                    publicPath:devConfig.filePath
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name].[ext]',
                    publicPath:devConfig.filePath
                }
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        historyApiFallback: true,
        host: 'localhost',
        port: devConfig.filePath.split(':').pop().split('/')[0]
    },
    plugins:[
        new PackDemoHtml({
            mode:'dev',
            config:path.join(__dirname,'./src/demo/config/chunkConfig')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks:4
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