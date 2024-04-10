const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');

module.exports = function (env, argv) {
    return {
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
                        /*{
                            loader: "style-loader",
                            options: { 
                                injectType: "singletonStyleTag" 
                            },
                        },*/
                        MiniCssExtractPlugin.loader,
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
            new MiniCssExtractPlugin(),
            new DefinePlugin({
                __WEBPACK_MODE__: JSON.stringify(argv.mode)
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.tsx', '.ts']
        }
    }
}
