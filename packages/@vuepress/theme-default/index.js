const path = require('path')

// Theme API.
module.exports = (options, ctx) => ({
  alias () {
    const { themeConfig, siteConfig } = ctx
    // resolve algolia
    const isAlgoliaSearch = (
      themeConfig.algolia
      || Object.keys(siteConfig.locales && themeConfig.locales || {})
        .some(base => themeConfig.locales[base].algolia)
    )
    return {
      '@AlgoliaSearchBox': isAlgoliaSearch
        ? path.resolve(__dirname, 'components/AlgoliaSearchBox.vue')
        : path.resolve(__dirname, 'noopModule.js')
    }
  },

  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/search',
    '@vuepress/plugin-nprogress',
    ['@vuepress/container', { type: 'tip' }],
    ['@vuepress/container', { type: 'warning' }],
    ['@vuepress/container', { type: 'danger' }],
    ['prism', {
      theme: 'tomorrow',
      preview: {
        '/': {
          beforeCodeBlock: '<p><strong>Input</strong></p>\n',
          beforePreview: '<p><strong>Output</strong></p>\n'
        },
        '/zh/': {
          beforeCodeBlock: '<p><strong>输入</strong></p>\n',
          beforePreview: '<p><strong>输出</strong></p>\n'
        }
      }
    }]
  ]
})
