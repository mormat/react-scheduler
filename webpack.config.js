const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// DefinePlugin

module.exports = {
    entry: {
        'mormat_react_scheduler':  ['./src/index.tsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: ( { chunk } ) => {
            if (chunk.name === 'styles') {
                return './include/[name].js';
            }
            return '[name].js';
        },
        library: 'mormat_react_scheduler',
        libraryTarget: 'umd'
    },
    devServer: {
        static: [
            { 
                directory: path.join(__dirname, 'public'),
                publicPath: '.'
            },
            {
                directory: path.join(__dirname, './node_modules/react/umd'),
                publicPath: './externals/react'
            },
            {
                directory: path.join(__dirname, './node_modules/react-dom/umd'),
                publicPath: './externals/react-dom'
            }
        ],
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
                { from: './public', to: '.' },
                { from: './node_modules/react/umd',     to: './externals/react' },
                { from: './node_modules/react-dom/umd', to: './externals/react-dom' }
            ]
        }),
    ],
    externals: {
        'react': {
            'commonjs': 'react',
            'commonjs2': 'react',
            'root': 'React'
        },
        'react-dom': {
            'commonjs': 'react-dom',
            'commonjs2': 'react-dom',
            'root': 'ReactDOM'
        },
    },
}
