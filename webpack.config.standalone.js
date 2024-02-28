const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// DefinePlugin

module.exports = {
    entry: {
        'mormat_standalone_scheduler':  ['./src/standalone.jsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                { from: './public', to: '.' },
            ]
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    }
}
