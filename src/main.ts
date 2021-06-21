import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'
import './styles/styles.scss'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('apexchart', VueApexCharts)
new Vue({
  render: h => h(App)
}).$mount('#app')

Vue.filter('formatDate', function (value:number) {
  if (value) {
    return moment.unix(value).format('MM/DD/YYYY hh:mm')
  }
})
