module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    /\bvue-echarts\b/,
    /\bresize-detector\b/
  ]
}
