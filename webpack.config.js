const path = require("path");
const cleanWebPackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");

const siteTitle = 'Restaurant Reviews 3';



module.exports = {
    entry: {
        'restaurant-list': './src/restaurant-list.js',
        'restaurant-detail': './src/restaurant-detail.js',
        'dbhelper': './src/dbhelper.js',
        'register-sw': './src/sw/register-sw.js',
        'main-sw': './src/sw/main-sw.js'
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
            // {
            //   test: /\.m?js$/,
            //   exclude: /(node_modules|bower_components)/,
            //   use: {
            //     loader: 'babel-loader',
            //     options: {
            //       presets: [
            //         [
            //           '@babel/preset-env',
            //           {
            //             'useBuiltIns': 'usage'
            //           }
            //         ],
            //         [
            //           '@babel/preset-react',
            //           {
            //             "pragma": "h"
            //           }
            //         ]
            //       ]
            //     }
            //   }
            // },
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
            title: siteTitle,
            template: './src/index.html',
            inject: false,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),        
        new HtmlWebpackPlugin({
            title: siteTitle,
            filename: 'restaurant.html',
            template: './src/restaurant.html',
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
            ]),
        new ImageminWebpWebpackPlugin({
          config: [{
            test: /\.(jpe?g|png)/,
            options: {
              quality:  30
            }
          }],
          //overrideExtension: true,
          detailedLogs: false,
          silent: false,
          strict: true
        })
    ]
};