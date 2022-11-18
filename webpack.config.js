export default {
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader"
      },
      {
        test: /\.node$/,
        loader: "node-loader",
      }]
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  externals: {
    'serialport': 'serialport',
  },
  mode: 'production'
};