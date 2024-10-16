/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const Dotenv = require("dotenv-webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const publicPath = "/";
const envVars = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};
const envKeys = Object?.keys(envVars).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
  return prev;
}, {});

module.exports = (env = {}) => {
  const isProduction = env.NODE_ENV === "production";
  // const apiUrl = isProduction ? envVars?.REACT_APP_BACKEND_URL : 'http://localhost:7004/';
  // const apiUrl = isProduction ? envVars?.REACT_APP_BACKEND_URL : 'http://37.60.255.54:7004/';
  const apiUrl = isProduction ? envVars?.REACT_APP_BACKEND_URL : 'http://82.180.147.10:7004';
  // const apiUrl = isProduction ? envVars?.REACT_APP_BACKEND_URL : 'https://adarsh.roshnroys.com/api/';
  return {
    mode: isProduction ? "production" : "development",
    entry: {
      app: ["regenerator-runtime/runtime.js", "./src/index.js"],
    },
    devtool: isProduction ? false : "inline-source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, "./"),
      },
      port: 3001,
      open: true, // Automatically open the browser
      historyApiFallback: true,
      allowedHosts: ['adarsh.roshnroys.com'],
    },
    externals: {
      // global app config object
      config: JSON.stringify({
        // API_URL: apiUrl || 'http://localhost:7004/',
        // API_URL: apiUrl || 'http://37.60.255.54:7004/',
        API_URL: apiUrl || 'http://82.180.147.10:7004',
        // API_URL: apiUrl || 'https://adarsh.roshnroys.com/api/',
        imageapiUrl: "",
        publicPath: "/",
      }),
    },
    output: {
      filename: "js/[name].bundle.js",
      path: path.resolve(__dirname, "dist"), // base path where to send compiled assets
      publicPath: publicPath, // base path where referenced files will be look for
    },
    resolve: {
      symlinks: true,
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        Assets: path.resolve(__dirname, "src/assets/"),
      },
      modules: [path.join(__dirname, "js/helpers"), "node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          // config for sass compilation
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
            {
              loader: "sass-loader",
            },
          ],
        },
        {
          test: /\.(jpg|png|svg|gif)$/,
          type: "asset/resource",
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0, 
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,              
            name: 'vendors',                
          },
          commons: {
            minChunks: 2,                   
            name: 'commons',            
            enforce: true,            
          },
        },
      },
    },
    performance: {
      hints: isProduction ? "warning" : false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
        // favicon: "./public/favicon.png",
      }),
      new MiniCssExtractPlugin({
        // plugin for controlling how compiled css will be outputted and named
        filename: "css/[name].css",
        chunkFilename: "css/[id].css",
      }),
      // new ServiceWorkerWebpackPlugin({
      //   entry: path.join(__dirname, "./public/firebase-messaging-sw.js"),
      // }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          "css/*.*",
          "js/*.*",
          "fonts/*.*",
          "images/*.*",
        ],
      }),
      new webpack.DefinePlugin(envKeys),
      new webpack.ProvidePlugin({
        //To automatically load jquery
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
      new Dotenv({
        path: "./.env",
        systemvars: true,
      }),
      new BundleAnalyzerPlugin({
        analyzerPort: 8889 
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./public/firebase-messaging-sw.js"),
            // to: config.dev.assetsSubDirectory,
          },
        ],
        options: {
          concurrency: 100,
        },
      }),
    ],
  };
};
