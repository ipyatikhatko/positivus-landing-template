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
    .filter((fileName) => {
      const filePath = path.join(pagesDir, fileName);
      return fs.statSync(filePath).isDirectory();
    })
    .map((fileName) => ({
      template: path.join(pagesDir, fileName, "index.pug"),
      filename: fileName === "home" ? "index.html" : `${fileName}.html`,
      templateParameters: {
        isDevelopment,
        getLink: (path) => {
          if (path === "/") return "/";
          return isDevelopment ? `/${path}.html` : `/${path}`;
        },
        require: require,
      },
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
    devMiddleware: {
      publicPath: "/",
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    watchFiles: {
      paths: ["src/**/*.pug", "src/**/*.scss"],
      options: {
        usePolling: true,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: {
          root: path.resolve(__dirname, "src"),
          basedir: path.resolve(__dirname, "src"),
          pretty: true,
        },
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
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src")],
              },
              additionalData: `@use "sass:math"; @use "@/styles/base/variables" as *;`,
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
          publicPath: "/",
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
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      isDevelopment: isDevelopment,
    }),
    // Dynamically create HtmlWebpackPlugin instances
    ...getPugPages().map(
      ({ template, filename, templateParameters }) =>
        new HtmlWebpackPlugin({
          template,
          filename,
          minify: !isDevelopment,
          templateParameters,
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
      "@": path.resolve(__dirname, "src"),
      "@layouts": path.resolve(__dirname, "src/views/layout"),
      "@components": path.resolve(__dirname, "src/views/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@views": path.resolve(__dirname, "src/views"),
    },
  },
};
