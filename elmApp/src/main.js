// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Moment from 'moment';
import MintUI from 'mint-ui';
// 引入全局样式
import './common/style/index.styl';
// 引入mint-ui的样式文件
import 'mint-ui/lib/style.css';
// 使用MUI的图片预览组件
/* eslint-disable */
// 1.引入mui.css文件
// import './lib/mui/css/mui.min.css';
// 2.引入mui.js文件
// import mui from './lib/mui/js/mui.min.js';
// 3.引入其他文件
// import './lib/mui/js/mui.zoom.js';
// import './lib/mui/js/mui.previewimage.js';
// 4.引入图片预览组件所需样式文件
// import './lib/previewImg.css';
Vue.config.productionTip = false;
// 使用axios
axios.defaults.baseURL = 'http://localhost:8080'; // 自动加在url前面，除非url是一个绝对URL
Vue.prototype.$ajax = axios;
// 使用日期格式化组件
Vue.filter('dateFormat', function (dateStr, pattern = 'YYYY-MM-DD HH:MM') {
  return Moment(dateStr).format(pattern);
});
Vue.use(MintUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
