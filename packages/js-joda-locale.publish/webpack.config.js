/*
 * @copyright (c) 2017, Philipp Thuerwaechter & Pattrick Hueper
 * @license BSD-3-Clause (see LICENSE.md in the root directory of this source tree)
 */

/*
 eslint-disable import/no-localeneous-dependencies, global-require
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const minify = JSON.parse(process.env.DIST_MIN || '0');
const sourceMaps = !minify;

function createBanner() {
    const packageJson = require('./package.json');
    const version = `//! @version ${packageJson.name} - ${packageJson.version}\n`;
    const preamble = fs.readFileSync('./src/license-preamble.js', 'utf8');
    return version + preamble;
}

const banner = createBanner();

module.exports = {
    context: __dirname,
    entry: ['babel-polyfill', './src/js-joda-locale.js'],
    devtool: sourceMaps ? 'hidden-source-map' : '',
    output: {
        path: `${__dirname}/dist`,
        filename: minify ? 'js-joda-locale.min.js' : 'js-joda-locale.js',
        libraryTarget: 'umd',
        library: 'JSJodaExtra',
    },
    externals: {
        'js-joda': {
            amd: 'js-joda',
            commonjs: 'js-joda',
            commonjs2: 'js-joda',
            root: 'JSJoda',
        },
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test'),
            ],
            test: /.js$/,
        }],
    },
    plugins: minify ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false,
            },
        }),
        new webpack.BannerPlugin({ banner, raw: true }),
    ] : [
        new webpack.BannerPlugin({ banner, raw: true }),
    ],
};