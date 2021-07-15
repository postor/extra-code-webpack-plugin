# extra-code-webpack-plugin

添加额外的代码的 webpack 插件 | add extra code plugin for webpack

## usage

install

```
npm i extra-code-webpack-plugin -D
```

webpack.config.js

```
const ExtraCodeWebpackPlugin = require('extra-code-webpack-plugin')
module.exports = {
  ...
  plugins:[
    new ExtraCodeWebpackPlugin({
      exclude:/node_modules/, // exclude files
      codes:`console.log('extra codes!')` // codes to add 
    })
  ]
}

```

## params

```
class ExtraCodeWebpackPlugin {
  /**
   * 
   * @param {object} config
   * @param {RegExp} config.exclude  default /node_modules/
   * @param {string|function({isDev:boolean,isEntry:boolean,modulePath:string}, webpackOption:object): string} config.codes default ''
   */
  constructor(config = {}) {}
}
```

## 使用案例 | example use case 

add hot reload

```
new ExtraCodeWebpackPlugin({ codes: ({ isDev, isEntry }) => (isEntry && isDev) ? `module.hot.accept()` : `` })
```


add analytics code

```
new ExtraCodeWebpackPlugin({ codes: ({ modulePath,isDev }) => 
  (!isDev && !relative(modulePath, join(__dirname, 'index.mjs'))) ? `'analytics code'` : `` })
```


