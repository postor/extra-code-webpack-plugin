const { NormalModule } = require('webpack')
const { isAbsolute, join } = require('path')
const pluginName = 'ExtraCodeWebpackPlugin'

class ExtraCodeWebpackPlugin {
  /**
   * 
   * @param {object} config
   * @param {RegExp} config.exclude
   * @param {string|function({isDev:boolean,isEntry:boolean,modulePath:string}, webpackOption:object): string} config.codes 
   */
  constructor(config = {}) {
    this.config = {
      exclude: /node_modules/,
      codes: ``,
      ...config
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation, compilationParams) => {
      let isDev = compilation.options.mode == 'development'
      let entries = this.getEntryFiles(compilation)
      NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(pluginName, (_, normalModule) => {
        let modulePath = normalModule.userRequest
        if (this.config.exclude.test(modulePath)){
          return
        }
        let isEntry = entries.has(modulePath)
          , codes = typeof this.config.codes == 'string'
            ? this.config.codes
            : this.config.codes({ isDev, isEntry, modulePath }, compilation.options)

        normalModule.loaders.push({
          loader: require.resolve('./loader.js'),
          options: {
            codes
          }
        })
      })
    })
  }

  getEntryFiles({ options: { entry, context }, }) {
    let rtn = new Set
    for (let k in entry) {
      for (let x of entry[k].import) {
        rtn.add(isAbsolute(x) ? x : join(context, x))
      }
    }
    return rtn
  }
}

module.exports = ExtraCodeWebpackPlugin
