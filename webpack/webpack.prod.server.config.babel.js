const pkg = require('../package.json')
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const extractCSS = new ExtractTextPlugin({
    filename: 'public/css/min/[name].bundle2.css',
     allChunks: true,
});

const isPROD = process.env.NODE_ENV === 'production'
module.exports = [
	{
		name: 'server',
		target: 'node',
		entry: './src/server/index.js',
		output: {
			path: path.join(__dirname, '../build'),
			filename: 'server.js',
			libraryTarget: 'commonjs2'
		},
		devtool: 'eval',
        //externals: nodeExternals(),
		resolve: {
            modules: [
                path.resolve(), 
                'node_modules', 
                'src'
            ],
			extensions: ['.js', '.jsx']
		},
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
			],
		},
		plugins: [
            extractCSS,
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
             new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }),
            new StatsPlugin('stats.server.json', {
                chunkModules: true,
                exclude: [/node_modules[\\\/]react/]
            }),
           
		]
	}
	
];