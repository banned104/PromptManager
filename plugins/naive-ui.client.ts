import { setup } from '@css-render/vue3-ssr'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const { collect } = setup(nuxtApp.vueApp)
    const unmount = nuxtApp.hook('app:rendered', () => {
      const style = collect()
      if (style) {
        const styleEl = document.createElement('style')
        styleEl.innerHTML = style
        document.head.appendChild(styleEl)
      }
      unmount()
    })
  }
})