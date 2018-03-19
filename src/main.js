// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  theme: {
    primary: '#19535F',
    secondary: '#587B7F',
    success: '#0B6E4F',
    info: '#28588D'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
