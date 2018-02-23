const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
    filename: 'public/css/min/[name].bundle1.css',
     allChunks: true,
});
const extractSASS = new ExtractTextPlugin({
    filename: 'public/css/min/[name].bundle2.css',
     allChunks: true,
});

module.exports = {
  devtool: "inline-source-map",
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:3002",
    "webpack/hot/only-dev-server",
    "./src/hot/client/client.js",
  ],
  target: "web",
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.join(__dirname, "../src/hot/client"),
          path.join(__dirname, "../src/app"),
        ],
        use: "babel-loader",
       
      },
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
      {// sass /scss loader for webpack
          exclude: /node_modules/,
          test: /\.(sass|scss)$/,
          use:  extractSASS.extract({
             use: ['css-loader','sass-loader'],
             fallback: 'style-loader'
          }),
      },
    ],
  },
  plugins: [
    extractCSS,
    extractSASS,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": { BUILD_TARGET: JSON.stringify("client") },
    }),
    
  ],
  devServer: {
    host: "localhost",
    port: 3002,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    path: path.join(__dirname, "../hot_build"),
    publicPath: "http://localhost:3002/",
    filename: "client.js",
  },
  resolve: {
            modules: [path.resolve(), 'node_modules', 'src'],
			extensions: ['.js', '.jsx']
   },
};
