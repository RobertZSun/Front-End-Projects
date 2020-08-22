const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // mode: 'development',
    entry: ['babel-polyfill', path.join(__dirname, '/src/js/index.js')],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: './js/bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
}