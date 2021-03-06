import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import _debug from 'debug'

const debug = _debug('build:production')

export default (webpackConfig) => {
  debug('Create configuration.')
  debug('Apply ExtractTextPlugin to CSS loaders.')
  delete webpackConfig.devtool

  webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader => {
    if (!loader.loaders ||
        !loader.loaders.find(name => /css/.test(name.split('?')[0]))) {
      return loader
    }

    const [first, ...rest] = loader.loaders
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders

    return loader
  })

  debug('Inject ExtractText and UglifyJS plugins.')
  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true
      }
    })
  )

  return webpackConfig
}
