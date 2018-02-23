const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin =require("start-server-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin({
    filename: 'public/css/[name].css',
     allChunks: true,
});
module.exports = {
    entry: ["webpack/hot/poll?1000","./src/hot/server/server.js"],
    output: {path: path.join(__dirname,"hot_build"),filename: "server.js"},
    watch: true,
    target: "node",
    externals: [nodeExternals({whitelist: ["webpack/hot/poll?1000"]})],
    module:{
        rules:[
            {test: /\.js?$/,use: "babel-loader",exclude: /node_modules/},
            
            {//regular css files
            test: /\.css$/,
            use: extractCSS.extract({
                            fallback: 'style-loader',
                            use: [
                                 {loader: 'css-loader',
                                  query:{
                                      modules: true,
                                      localIdentName: '[name]__[local]__[hash:base64:5]'
                                  }
                                 },
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
    plugins:[
        extractCSS,
        new StartServerPlugin("server.js"),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {BUILD_TARGET: JSON.stringify("server")},
        }),
    ]
        
}