const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// DefinePlugin

module.exports = {
    entry: {
        'index':  ['./src/index.jsx'],
        'styles': ['./src/styles.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: ( { chunk } ) => {
            if (chunk.name === 'styles') {
                return '../include/[name].js';
            }
            return '[name].js';
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
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
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './public', to: '.' }
            ]
        }),
    ]
}
