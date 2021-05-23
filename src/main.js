import Vue from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import BootstrapVue  from "bootstrap-vue";
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import VueApexCharts from 'vue-apexcharts'
import VueSpinners from 'vue-spinners'
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import JsonExcel from "vue-json-excel";


Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('apexchart', VueApexCharts)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
Vue.component('datetime', Datetime);
Vue.component("downloadExcel", JsonExcel);

Vue.use(VueSpinners)
Vue.use(VueApexCharts)
Vue.use(BootstrapVue)
library.add(fab, fas, far)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
