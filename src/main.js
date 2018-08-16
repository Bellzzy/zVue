// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import commonComponents from './components/common'

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/common.styl'
// 指令
import './js/directive.js'
// 通用方法
import './js/util.js'
// 过滤器
import './js/filter.js'
// 表单校验
import validate from './js/validate.js'

Vue.prototype.__Valid = validate;

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(commonComponents);
Vue.use(VueAxios, axios);

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  data: {
  	events: new Vue(),
  },
  template: '<App/>'
})

// axios请求拦截
axios.interceptors.request.use(config => {
  config.headers['user-token'] = sessionStorage.getItem('token');
  config.url = '/cc-tms' + config.url;
  return config
}, err => {
  if(err instanceof Error) {
    vm.$message.error(err.message);
  }
  return Promise.reject(err);
})
// axios响应拦截
axios.interceptors.response.use(res => {
	let data = res.data;
	if(200 != data.code) {
    if(301 == data.code) {
      if(!document.querySelector('.el-message--error')) {
        vm.$message.error('请重新登录.')
        sessionStorage.removeItem('token')
        router.push({path: '/'})
      };
    } else {
      vm.$message.error(data.msg || '');
    }
	}
  return res.data
}, err => {
  if(err instanceof Error) {
    vm.$message.error(err.message);
  }
  return Promise.reject(err);
});