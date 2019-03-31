// Modified from https://github.com/egoist/markdown-it-highlight-lines

const HIGHLIGHT_LINES_REGEX = /{([\d,-]+)}/

module.exports = (md) => {
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index]

    if (!token.lineNumbers) {
      const rawInfo = token.info

      // ensure the next plugin get the correct lang
      token.info = rawInfo.replace(HIGHLIGHT_LINES_REGEX, '').trim()

      const match = rawInfo.match(HIGHLIGHT_LINES_REGEX)
      token.lineNumbers = (match ? match[1] : '')
        .split(',')
        .map(v => v.split('-').map(v => parseInt(v, 10)))
    }

    const code = options.highlight
      ? options.highlight(token.content, token.info)
      : token.content

    const highlightLinesCode = code.split('\n').slice(1).map((split, index) => {
      const lineNumber = index + 1
      const inRange = token.lineNumbers.some(([start, end]) => {
        if (start && end) {
          return lineNumber >= start && lineNumber <= end
        }
        return lineNumber === start
      })
      return inRange
        ? '<div class="highlighted">&nbsp;</div>'
        : '<br>'
    }).join('')

    return code.replace(
      '<!--before-->',
      '<!--before-->'
        + '<div class="highlight-lines">'
        + highlightLinesCode
        + '</div>'
    )
  }
}
