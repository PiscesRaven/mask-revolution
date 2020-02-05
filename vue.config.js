
const baseUrl = process.env.NODE_ENV === 'production' ? './' : '/'

module.exports = {
  // filenameHashing: false,
  devServer: { https: true },
  productionSourceMap: false,
  publicPath: baseUrl,
  configureWebpack: {
    resolve: {
      alias: {
        '@as': '@/assets',
        '@c': '@/components',
        '@img': '@/assets/img',
        '@css': '@/assets/css',
        '@api': '@/api'
      }
    }
  }
}
