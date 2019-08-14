import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = "http://192.168.1.188:12"//调用端口
Vue.use(VueAxios, axios)

//http request 请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 拦截每次请求,携带token
    config.headers.Authorization = sessionStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

//http response 响应拦截器
axios.interceptors.response.use(response => {
 	return response;
},error => {
 	if (error.response) {
		switch (error.response.status) {
			// 返回401，清除token信息并跳转到登录页面
			case 401:
		localStorage.removeItem('token');
			router.replace({
				path: '/',
				//登录成功后跳入浏览的当前页面
				//query: {redirect: router.currentRoute.fullPath}
			})
		}
		// 返回接口返回的错误信息
		return Promise.reject(error);
	}
});

//设置路由守卫
// router.beforeEach((to, from, next) => {
// //console.log(to);即将要进入的目标 路由对象
// //console.log(from);当前导航正要离开的路由
// if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if(sessionStorage.getItem('name')){ //判断本地是否存在sessionStorage
//       next();
//     }else {
//       next({
//         path:'/',
//         query:{redirect:location.hostname}//跳转到以前的路由
//       })
//     }
// }
// else {
//     next();
// }
// /*如果本地 存在 sessionStorage 则 不允许直接跳转到 登录页面*/
// if(to.fullPath == "/"){
//     if(sessionStorage.getItem('name')){
//       next({
//         path:from.fullPath
//       });
//     }else {
//       next();
//     }
// }
// });					

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')