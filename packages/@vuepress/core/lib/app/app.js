import Vue from 'vue'
import Router from 'vue-router'
import dataMixin from './dataMixin'
import { findPageByKey } from './util'
import { routes } from '@internal/routes'
import { siteData } from '@internal/siteData'
import hotUpdate from '@internal/hot-update.js'
import appEnhancers from '@internal/app-enhancers'
import globalUIComponents from '@internal/global-ui'
import ClientComputedMixin from '@transform/ClientComputedMixin'
import VuePress from './plugins/VuePress'

// built-in components
import Content from './components/Content.js'
import ContentSlotsDistributor from './components/ContentSlotsDistributor'
import OutboundLink from './components/OutboundLink.vue'
import ClientOnly from './components/ClientOnly'

// suggest dev server restart on base change
if (module.hot) {
  const prevBase = siteData.base
  module.hot.accept('@internal/siteData', () => {
    if (siteData.base !== prevBase) {
      window.alert(
        `[vuepress] Site base has changed. ` +
        `Please restart dev server to ensure correct asset paths.`
      )
    } else {
      // console.log('siteData changed!')
      // Vue.$vuepress.store.state.siteData = siteData
    }
  })

  module.hot.accept('@internal/hot-update.js', () => {
    const ne = hotUpdate
    const site = Vue.$vuepress.$get('siteData')
    const ol = findPageByKey(site.pages, ne.key)
    const pageIndex = site.pages.findIndex(page => page.key === ne.key)

    if (JSON.stringify(ol.headers) !== JSON.stringify(ne.headers)) {
      console.log('Header Changed!')
      ol.headers = ne.headers
      Vue.$vuepress.$emit('changed')
    } else if (JSON.stringify(ol.frontmatter) !== JSON.stringify(ne.frontmatter)) {
      console.log('Frontmatter Changed!')
      ol.frontmatter = ne.frontmatter
      Vue.$vuepress.$emit('changed')
    }
    console.log(site.pages[pageIndex])
  })
}

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(VuePress)
// mixin for exposing $site and $page
Vue.mixin(dataMixin(ClientComputedMixin, siteData))
// component for rendering markdown content and setting title etc.

Vue.component('Content', Content)
Vue.component('ContentSlotsDistributor', ContentSlotsDistributor)
Vue.component('OutboundLink', OutboundLink)
// component for client-only content
Vue.component('ClientOnly', ClientOnly)

// global helper for adding base path to absolute urls
Vue.prototype.$withBase = function (path) {
  const base = this.$site.base
  if (path.charAt(0) === '/') {
    return base + path.slice(1)
  } else {
    return path
  }
}

export function createApp (isServer) {
  const router = new Router({
    base: siteData.base,
    mode: 'history',
    fallback: false,
    routes,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else if (to.hash) {
        if (Vue.$vuepress.$get('disableScrollBehavior')) {
          return false
        }
        return {
          selector: to.hash
        }
      } else {
        return { x: 0, y: 0 }
      }
    }
  })

  // redirect /foo to /foo/
  router.beforeEach((to, from, next) => {
    if (!/(\/|\.html)$/.test(to.path)) {
      next(Object.assign({}, to, {
        path: to.path + '/'
      }))
    } else {
      next()
    }
  })

  const options = {}

  try {
    appEnhancers.forEach(enhancer => {
      if (typeof enhancer === 'function') {
        enhancer({ Vue, options, router, siteData, isServer })
      }
    })
  } catch (e) {
    console.error(e)
  }

  const app = new Vue(
    Object.assign(options, {
      router,
      render (h) {
        return h('div', { attrs: { id: 'app' }}, [
          h('router-view', { ref: 'layout' }),
          h('div', { class: 'global-ui' }, globalUIComponents.map(component => h(component)))
        ])
      }
    })
  )

  return { app, router }
}
