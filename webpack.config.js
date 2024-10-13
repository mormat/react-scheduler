const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');
const { createJsonServer } = require('./src/stubs/json_server');
const path = require('path');
const fs = require('fs');

module.exports = function (env, argv) {
    
    if (env.WEBPACK_SERVE) {
        const jsonServer = createJsonServer();
        jsonServer.listen(3000, () => {
            console.log('JSON server is running at 3000');
        });
    }
    
    const package_infos = get_package_infos();
    const examples = scan_examples();
    
    return {
        entry: {
            'index':            ['./src/index.js'],
            'examples':         ['./src/examples.js'],
            'react_scheduler':  ['./src/react_scheduler.js'],
            ...Object.fromEntries( Object.keys(examples).map(
                f => ['examples__' + f, './src/examples/' + f]
            ) )
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: ({ chunk }) => chunk.name.replace('__', '/') + '.js',
            library: '[name]',
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
            proxy: [
                {
                    context: ['/events'],
                    target: 'http://localhost:3000',
                },
            ],
            compress: true,
            port: 9000,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader',
                    ]
                },
                {
                    test: /\.s[ac]ss|css$/i,
                    use: [
                        // 'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader', 
                        'sass-loader',
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                '@src': path.resolve(__dirname, 'src')
            }
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: './public', to: '.' },
                    { from: './node_modules/react/umd',     to: './externals/react' },
                    { from: './node_modules/react-dom/umd', to: './externals/react-dom' }
                ]
            }),
            new MiniCssExtractPlugin(),
            new DefinePlugin({
                __EXAMPLES_SOURCES__: JSON.stringify(examples),
                __WEBPACK_MODE__:     JSON.stringify(argv.mode),
                __PACKAGE_INFOS__:    JSON.stringify(package_infos)
            })
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
            '@mormat/react_scheduler': 'react_scheduler'
        },
    }
}

function scan_examples() {
    const folder = path.join(__dirname, 'src', 'examples');
    return Object.fromEntries(
        fs.readdirSync(folder).map( filename => [
            filename.split('.')[0],
            fs.readFileSync(path.join(folder, filename), 'utf8')
        ])
    );
}

function get_package_infos() {
    const filename = path.join(__dirname, 'package.json');
    const contents = fs.readFileSync(filename,'utf8');
    return JSON.parse(contents);
}
