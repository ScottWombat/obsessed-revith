const pkg = require('../package.json')
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const extractCSS = new ExtractTextPlugin({
    filename: '../css/[name].bundle.css',
     allChunks: true,
});

const isPROD = process.env.NODE_ENV === 'production'
module.exports = [
	{
		name: 'client',
		target: 'web',
		entry: {
            app : './src/shared/app/index.js',
            vendor: ['react']
        },
        output: {
            path: path.join(__dirname, '../build/public/js'),
            filename: "[name].[chunkhash:8].js",
			publicPath: '/static/',
		},
		resolve: {
            modules: [path.resolve(), 'node_modules', 'src'],
			extensions: ['.js', '.jsx']
		},
		devtool: 'eval',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules\/)/,
					use: [
						{
							loader: 'babel-loader',
						}
					]
				},
                {//regular css files
                        test: /\.css$/,
                        use: extractCSS.extract({
                            fallback: 'style-loader',
                            use: [
                                 {loader: 'css-loader'},
                                 {loader: 'postcss-loader',
                                            options: {
                                                plugins: (loader) => [
                                                    require('autoprefixer')({browsers: ['last 2 versions','last 2 Chrome versions','ie >= 10','Firefox > 20','safari 5','safari 5']}),
                                                ]
                                            }
                                 }
                            ]
                        })
                },
				{
					test: /\.scss$/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
							options: {
								modules: true,
								importLoaders: 1,
								localIdentName: '[hash:base64:10]',
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader'
						}
					]
				}     
			],
		},
		plugins: [
             extractCSS,
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: "'production'"
				}
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					screw_ie8: true,
					drop_console: true,
					drop_debugger: true
				},
                sourceMap: true,
                minimize: true
			}),
			new webpack.optimize.OccurrenceOrderPlugin(),
            new StatsPlugin('stats.client.json', {
                chunkModules: true,
                exclude: [/node_modules[\\\/]react/]
            }),
             new HtmlWebpackPlugin({
                title: 'Obsessed',
                filename: '../views/index.pug',
                template: 'views/index.pug'
            }),
            new HtmlWebpackPugPlugin(),
            
            new CopyWebpackPlugin([
                {from:'assets/img',to:'../img'} 
            ]), 
            
		]
	}
	
];