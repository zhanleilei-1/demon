import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/Home.vue'
import manageRouter from './router/manage.js'
import testRouter from './router/test.js'


Vue.use(Router)

export default new Router({
   mode: 'history',
  base: process.env.BASE_URL,//及路径
  routes: [
		{
			path: '/',
			name:'login',
			component: Login
		},
		{
			path: '/home',
			name:'home',
			component: Home,
			children:[
				...manageRouter,//...代表展开数组
				...testRouter
			]
		}
  ]
})
