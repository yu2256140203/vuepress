module.exports = (options, context) => ({
  chainMarkdown (md) {
    md.plugin('import-code')
      .use(require('./markdown'), [options])
  }
})
