const { resolve } = require('path')

module.exports = (options, context) => ({
  name: 'vuepress-plugin-prism',

  chainMarkdown (md) {
    md.options
      .highlight(require('./highlight'))

    md.plugin('highlight-lines')
      .use(require('./highlightLines'))

    md.plugin('line-numbers')
      .use(require('./lineNumbers'), options)
  },

  enhanceAppFiles () {
    const { theme } = options
    const themeStyleFile = !theme || theme === 'default'
      ? 'prism'
      : 'prism-' + theme
    return [
      resolve(__dirname, 'enhanceApp.js'),
      {
        name: 'prism-theme.js',
        content: `import 'prismjs/themes/${themeStyleFile}.css'`
      }
    ]
  }
})
