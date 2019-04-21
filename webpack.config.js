const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'simflux.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules|dist/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env'], // [ '@babel/<presetName>', ... ]
                    plugins: [] // plugins format: [ <pluginName>, ... ]
                }
            }
        }]
    },
    plugins: [
        new UglifyJsPlugin(),
        new CleanWebpackPlugin()
    ],
    mode: 'none'
}
