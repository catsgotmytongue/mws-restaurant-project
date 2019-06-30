const path = require("path");
const cleanWebPackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/main.js',
        restaurant_info: './src/restaurant_info.js',
        dbhelper: './src/dbhelper.js',
        register_sw: './src/sw/register-sw.js',
        sw: './src/sw/main-sw.js'
    },
    resolve: {
        modules: ['node_modules']
      },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new cleanWebPackPlugin.CleanWebpackPlugin(),
        new CopyPlugin([
                {from: 'src/*.html', to: '[name].[ext]'},
                {from: 'css/*.css', to: 'css/[name].[ext]'},
                {from: 'assets/img/*', to: 'img/[name].[ext]'},
                {from: 'assets/favicon.ico', to: 'favicon.ico'},
            ])
    ]
};