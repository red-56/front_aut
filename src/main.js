import Vue from "vue";
import App from "./App";
import router from './router';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Plugins
import GlobalDirectives from "./globalDirectives";

// MaterialDashboard plugin
import MaterialDashboard from './material-dashboard';

import Chartist from 'chartist';

import * as am4core from "@amcharts/amcharts4/core";

// import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

Vue.prototype.$Chartist =Chartist;

Vue.use(MaterialDashboard);
Vue.use(GlobalDirectives);

Vue.config.productionTip = false

new Vue({
  el: "#app",
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App),
});
