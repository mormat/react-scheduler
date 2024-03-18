const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// DefinePlugin

console.log("STANDALONE FOLDER", path.join(__dirname, 'web'));

module.exports = {
    entry: {
        'mormat_standalone_scheduler':  [path.resolve(__dirname,'./src/index.jsx')],
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js',
        library: 'mormat_standalone_scheduler',
        libraryTarget: 'umd'
    },
    devServer: {
        static: [
            { 
                directory: path.join(__dirname, 'public'),
                publicPath: '.'
            }
        ],
        compress: true,
        port: 9001,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: "style-loader",
                        options: { 
                            injectType: "singletonStyleTag" 
                        },
                    },
                    'css-loader', 
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, 'public'), to: '.' },
            ]
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    }
}
