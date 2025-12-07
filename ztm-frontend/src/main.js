import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import notificationPlugin from './plugins/notification'
import vTooltip from './directives/vTooltip'
import vDelayColor from './directives/vDelayColor'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(notificationPlugin)
app.directive('tooltip', vTooltip)
app.directive('delay-color', vDelayColor)

app.mount('#app')
