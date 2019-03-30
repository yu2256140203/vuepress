function shouldRenderLineNumbers (token, frontmatter, fallback) {
  const meta = token.info.split(/ +/g)
  if (meta.includes('line-numbers')) {
    return true
  } else if (meta.includes('no-line-numbers')) {
    return false
  } else if ('lineNumbers' in frontmatter) {
    return frontmatter.lineNumbers
  } else {
    return fallback
  }
}

module.exports = (md, options) => {
  const fence = md.renderer.rules.fence
  const { lineNumbers = false } = options

  md.renderer.rules.fence = (tokens, index, _, env, self) => {
    const rawCode = fence(tokens, index, _, env, self)
    const token = tokens[index]
    const { frontmatter = {}} = env
    if (!shouldRenderLineNumbers(token, frontmatter, lineNumbers)) {
      return rawCode
    }

    const code = rawCode.slice(
      rawCode.indexOf('<code>'),
      rawCode.lastIndexOf('</code>')
    )

    const lineNumbersCode = code
      .split('\n')
      .slice(1)
      .map((_, index) => `<span class="line-number">${index + 1}</span><br>`)
      .join('')

    return rawCode
      .replace(/^<div class="code-block/, '<div class="code-block has-line-numbers')
      .replace(
        '<!--before-->',
        '<!--before-->'
          + '<div class="line-numbers">'
          + lineNumbersCode
          + '</div>'
      )
  }
}
