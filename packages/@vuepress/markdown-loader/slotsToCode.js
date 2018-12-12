module.exports = function slotsToCode (map) {
  return Object.keys(map)
    .map((slotKey, index) => {
      return `<template ${index === 0 ? 'v-if' : 'v-else-if'}="$parent.slotKey === '${slotKey}' ">` + map[slotKey] + `</template>`
    })
    .join('\n')
}
