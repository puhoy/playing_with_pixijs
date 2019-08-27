const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: Path.resolve(__dirname, '../src/scripts/index.js')
    },
    devtool: 'inline-source-map',
    output: {
        path: Path.join(__dirname, '../public'),
        filename: 'js/[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {from: Path.resolve(__dirname, '../src/assets'), to: 'assets'}
        ]),
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, '../src/index.html')
        })
    ],
    resolve: {
        alias: {
            '~': Path.resolve(__dirname, '../src')
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            },
            {
                test: /\.(json)(\?.*)?$/,
                loader: 'json-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};
