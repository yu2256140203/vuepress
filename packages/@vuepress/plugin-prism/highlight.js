const prism = require('prismjs')
const defaultLanguageMap = require('./languageMap')
const loadLanguages = require('prismjs/components/index')
const { logger, chalk, escapeHtml } = require('@vuepress/shared-utils')

function wrap (code, lang) {
  return `<div class="code-block">`
    + (lang ? `<div class="language-name">${escapeHtml(lang)}</div>` : '')
    + `<!--before-->`
    + `<pre v-pre><code>${code}</code></pre>`
    + `<!--after-->`
    + `</div>`
}

module.exports = (options) => {
  // required to make embedded highlighting work...
  const {
    preload = ['markup', 'css', 'javascript'],
    languageMap: customLanguageMap = {}
  } = options

  loadLanguages(preload)

  const languageMap = {
    ...defaultLanguageMap,
    ...customLanguageMap
  }

  return (str, lang) => {
    lang = lang.split(/ +/g)[0]
    if (!lang) return wrap(escapeHtml(str))

    const rawLang = lang
    lang = lang.toLowerCase()
    if (lang in languageMap) {
      lang = languageMap[lang]
    }

    if (!prism.languages[lang]) {
      try {
        loadLanguages([lang])
      } catch (e) {
        logger.warn(chalk.yellow(`[vuepress] Syntax highlight for language "${lang}" is not supported.`))
      }
    }

    if (prism.languages[lang]) {
      const code = prism.highlight(str, prism.languages[lang], lang)
      return wrap(code, rawLang)
    } else {
      return wrap(escapeHtml(str), rawLang)
    }
  }
}
