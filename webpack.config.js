var vue = require('vue-loader')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader")

module.exports = {
	entry: {
		app: './src/app.js'
	},
	mode: 'production',
	output: {
		path: './build',
		publicPath: '/build/',
		filename: 'bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.vue$/,
			loader: 'vue'
		},
		{
			test: /\.js$/,
			loader: 'babel-loader'
		},
		{ test: /\.css$/, loader: cssLoader }
		]
	},
	devtool: "#source-map",
}

if (process.env.NODE_ENV === 'production') {

	delete module.exports.devtool
	module.exports.plugins = [
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),
	new webpack.optimize.OccurenceOrderPlugin()
	]
} else {
}
