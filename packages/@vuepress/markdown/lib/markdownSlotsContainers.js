const container = require('markdown-it-container')

const SLOT_KEY = 'slot'

module.exports = md => {
  md
    .use(container, SLOT_KEY, {
      render: (tokens, idx) => {
        const slot = tokens[idx].info.trim().slice(SLOT_KEY.length).trim()
        return tokens[idx].nesting === 1
          ? `|slot|$$${slot}$$`
          : '|slot|'
      }
    })
}
