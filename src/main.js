import Vue from 'vue';
import App from './App.vue';
import vuetify from "vuetify";
import Vuetify from "vuetify/lib";
import router from './router';
import './configs/axios';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

Vue.config.productionTip = false
Vue.use(vuetify);

new Vue({
  vuetify: new Vuetify(),
  router,
  render: h => h(App)
}).$mount('#app')
