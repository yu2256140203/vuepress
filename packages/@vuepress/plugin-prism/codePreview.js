const PREVIEW_OPTIONS = [
  'beforeCodeBlock',
  'afterCodeBlock',
  'beforePreview',
  'afterPreview'
]

module.exports = (md, options = {}) => {
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, index, _, env, self) => {
    const codeBlock = fence(tokens, index, _, env, self)
    const token = tokens[index]
    const meta = token.info.split(/ +/g)
    const { relativePath = '' } = env

    if (!meta.includes('preview')) return codeBlock

    const _options = {}
    for (const path in options) {
      if (PREVIEW_OPTIONS.includes(path)) {
        _options[path] = options[path]
      } else if (relativePath.startsWith(path.replace(/^\//, ''))) {
        Object.assign(_options, options[path])
        if (path !== '/') break
      }
    }

    const { html: preview } = md.render(token.content, env)
    const {
      beforeCodeBlock = '',
      afterCodeBlock = '',
      beforePreview = '',
      afterPreview = ''
    } = _options

    return beforeCodeBlock
      + codeBlock
      + afterCodeBlock
      + beforePreview
      + preview
      + afterPreview
  }
}
