const { getOptions } = require('loader-utils')

module.exports = function (source) {
  const { codes = '' } = getOptions(this)
  return codes ? source + '\n;' + codes : source
}