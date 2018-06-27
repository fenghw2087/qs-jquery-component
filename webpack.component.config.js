/**
 * Created by Administrator on 2018/2/1.
 */
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {'datePicker':path.join(__dirname, './src/buildComponent/index')},
    output:{
        filename: 'js/[name].min.js',
        path: path.join(__dirname, './component-bundle/'),
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
            test: /\.less/,
            use: ["style-loader", "css-loader", "postcss-loader", "less-loader",]
        },{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, './src')
        }]
    },
    plugins:[
        new UglifyJSPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ]
};