/**
 * Created by Administrator on 2018/1/19.
 */
/**
 * Created by 2087 on 2017/12/26.
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: {'test':path.join(__dirname, './src/test/index')},
    output:{
        filename: 'js/[name].js',
        path: path.join(__dirname, './test-bundle/'),
    },
    externals: {
        'jquery': 'window.jQuery',
        'angular': 'window.angular'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"]
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
                    publicPath:'http://127.0.0.1:9999/'
                }
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, './test-bundle'),
        historyApiFallback: true,
        host: 'localhost',
        port: 9999
    },
    plugins:[
        new webpack.HashedModuleIdsPlugin()
    ]
};