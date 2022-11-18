import nodeExternals from 'webpack-node-externals';
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
  externals: [
    nodeExternals({
      allowlist: ["chalk", "string-width"]
    })
  ],
  node: {
    __dirname: false,
  },
  output: {
    filename: 'main.cjs'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  mode: 'production'
};