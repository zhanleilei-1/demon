import classManage from '../views/manage/classManage.vue'
import studentManage from '../views/manage/studentManage.vue'
import teacherManage from '../views/manage/teacherManage.vue'
// import changePassword from './views/manage/changePassword.vue'

export default 
	[
		{
			path: '/classManage',
			name:'classManage',
			component: classManage
		},
		{
			path: '/studentManage',
			name:'studentManage',
			component: studentManage
		},
		{
			path: '/teacherManage',
			name:'teacherManage',
			component: teacherManage
		}
		// {
		// 	path: '/changePassword',
		// 	name:'changePassword',
		// 	component: changePassword
		// }
	]
