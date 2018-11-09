module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/sealevel-static/'
    : '/',
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    /\bvue-echarts\b/,
    /\bresize-detector\b/
  ]
}
