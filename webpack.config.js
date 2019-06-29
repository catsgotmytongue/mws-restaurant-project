const path = require("path");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    resolve: {
        modules: ['node_modules']
      },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};