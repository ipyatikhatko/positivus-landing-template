const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");

const isDevelopment = process.env.NODE_ENV !== "production";

// Get all Pug files from pages directory
const getPugPages = () => {
  const pagesDir = "./src/views/pages";
  return fs
    .readdirSync(pagesDir)
    .filter((fileName) => fileName.endsWith(".pug"))
    .map((fileName) => ({
      template: path.join(pagesDir, fileName),
      filename: fileName.replace(".pug", ".html"),
    }));
};

module.exports = {
  mode: isDevelopment ? "development" : "production",
  target: "web",
  entry: [
    isDevelopment && "webpack-hot-middleware/client",
    "./src/js/main.js",
  ].filter(Boolean),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isDevelopment ? "js/[name].js" : "js/[name].[contenthash].js",
    publicPath: "/",
    assetModuleFilename: "assets/[name][ext]",
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    hot: true,
    watchFiles: {
      paths: ["src/**/*.pug", "src/**/*.scss"],
      options: {
        usePolling: true,
      },
    },
    liveReload: true,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: isDevelopment
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            options: isDevelopment
              ? {
                  insert: "head",
                  injectType: "singletonStyleTag",
                }
              : {},
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
    ],
  },

  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    !isDevelopment && new CleanWebpackPlugin(),
    !isDevelopment &&
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        chunkFilename: "css/[id].[contenthash].css",
      }),
    // Dynamically create HtmlWebpackPlugin instances
    ...getPugPages().map(
      ({ template, filename }) =>
        new HtmlWebpackPlugin({
          template,
          filename,
          minify: !isDevelopment,
          templateParameters: {
            process: {
              env: {
                NODE_ENV: process.env.NODE_ENV,
              },
            },
          },
        })
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/fonts",
          to: "assets/fonts",
        },
      ],
    }),
  ].filter(Boolean),

  devtool: isDevelopment ? "eval-source-map" : false,

  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  watch: isDevelopment,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
    },
  },
};
