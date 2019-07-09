const path = require("path");
const cleanWebPackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
        restaurant_list: './src/main.js',
        restaurant_detail: './src/restaurant_detail.js',
        dbhelper: './src/dbhelper.js',
        register_sw: './src/sw/register-sw.js',
        sw: './src/sw/main-sw.js'
    },
    resolve: {
        modules: ['node_modules']
      },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new cleanWebPackPlugin.CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Restaurant Reviews 3',
            template: './src/index.html',
            inject: false,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),        
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyPlugin([              
                {from: 'src/*.html', to: '[name].[ext]'},
                {from: 'css/*.css', to: 'css/[name].[ext]'},
                {from: 'src/assets/img/*', to: 'img/[name].[ext]'},
                {from: 'src/assets/favicon.ico', to: 'favicon.ico'},
                {from: 'src/assets/manifest.json', to: 'manifest.json'},
            ])
    ]
};