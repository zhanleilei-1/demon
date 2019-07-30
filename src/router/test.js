import makePaper from '../views/test/makePaper.vue'
import maintain from '../views/test/maintain.vue'
import arrangeTest from '../views/test/arrangeTest.vue'
import readPapers from '../views/test/readPapers.vue'
import studentGrade from '../views/test/studentGrade.vue'

export default
	[
		{
			path: '/makePaper',
			name:'makePaper',
			component: makePaper
		},
		{
			path: '/maintain',
			name:'maintain',
			component: maintain
		},
		{
			path: '/arrangeTest',
			name:'arrangeTest',
			component: arrangeTest
		},
		{
			path: '/readPapers',
			name:'readPapers',
			component: readPapers
		},
		{
			path: '/studentGrade',
			name:'studentGrade',
			component: studentGrade
		}
	]
