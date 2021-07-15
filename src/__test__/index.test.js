const Plugin = require('../index')
const webpack = require('webpack')
const { join, relative } = require('path')
const { readFileSync } = require('fs')
const EXTRACODE = 'EXTRACODE'

let tests = [
  {
    title: 'works',
    config: { codes: ({ isDev, isEntry }) => (isEntry && isDev) ? `console.log('${EXTRACODE}')` : `` },
    includes: true
  },
  {
    title: 'is-dev',
    config: { codes: ({ isDev }) => (!isDev) ? `console.log('${EXTRACODE}')` : `` },
    includes: false
  },
  {
    title: 'is-entry',
    config: { codes: ({ isEntry }) => (!isEntry) ? `console.log('${EXTRACODE}')` : `` },
    includes: false
  },
  {
    title: 'option',
    config: {
      codes: (_, option) => (option.mode == 'development') ? `console.log('${EXTRACODE}')` : ``
    },
    includes: true
  },
  {
    title: 'exclude',
    config: {
      exclude: /a/,
      codes: `console.log('${EXTRACODE}')`
    },
    includes: false
  },
  {
    title: 'module-path',
    config: {
      codes: ({ modulePath }) => (!relative(modulePath, join(__dirname, 'a.mjs'))) ? `console.log('${EXTRACODE}')` : ``
    },
    includes: true
  }
]

for (let { title, config, includes } of tests) {
  let outFileName = `${title}.js`
  it(title, done => {
    const distPath = join(__dirname, 'dist')
    const compiler = webpack({
      context: __dirname,
      output: {
        path: distPath,
        filename: outFileName
      },
      entry: join(__dirname, 'a.mjs'),
      plugins: [new Plugin(config)],
      mode: 'development'
    })

    compiler.run((err, stats) => {
      if (err) throw err
      let content = readFileSync(join(distPath, outFileName), 'utf-8')
      expect(content.includes(EXTRACODE)).toBe(includes)
      compiler.close(err => {
        if (err) throw err
        done()
      })
    })
  })
}
