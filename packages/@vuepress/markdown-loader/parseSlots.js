module.exports = function parseSlots (str) {
  const map = {}
  str.split('|slot|')
    .filter(v => v.trim())
    .forEach(v => {
      let slotKey
      let content
      if (v.startsWith('$$')) {
        content = v.slice(2)
        const endIndex = content.indexOf('$$')
        slotKey = content.slice(0, endIndex)
        content = content.slice(endIndex + 2)
      } else {
        slotKey = 'default'
        content = v
      }
      if (!map[slotKey]) {
        map[slotKey] = ''
      }
      map[slotKey] += content
    })
  return map
}

