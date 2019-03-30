const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')
const { logger, chalk, escapeHtml } = require('@vuepress/shared-utils')

// required to make embedded highlighting work...
loadLanguages(['markup', 'css', 'javascript'])

function wrap (code, lang) {
  if (lang === 'text') {
    code = escapeHtml(code)
  }
  return `<div class="code-block">`
    + (lang === 'text' ? '' : `<div class="language-name">${escapeHtml(lang)}</div>`)
    + `<!--before-->`
    + `<pre v-pre><code>${code}</code></pre>`
    + `<!--after-->`
    + `</div>`
}

module.exports = (str, lang) => {
  if (!lang) {
    return wrap(str, 'text')
  }
  lang = lang.toLowerCase()
  const rawLang = lang
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup'
  }
  if (lang === 'md') {
    lang = 'markdown'
  }
  if (lang === 'rb') {
    lang = 'ruby'
  }
  if (lang === 'ts') {
    lang = 'typescript'
  }
  if (lang === 'py') {
    lang = 'python'
  }
  if (lang === 'sh') {
    lang = 'bash'
  }
  if (lang === 'yml') {
    lang = 'yaml'
  }
  if (lang === 'styl') {
    lang = 'stylus'
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
  }
  return wrap(str, 'text')
}
