import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { initAOS, refreshAOS } from './plugins/aos'

import RevealDirective from './directives/reveal'

const app = createApp(App)

app.directive('reveal', RevealDirective)

app.mount('#app')

requestAnimationFrame(() => {
  initAOS()
})

if (import.meta && import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
    setTimeout(() => {
      refreshAOS()
    }, 0)
  })
}
