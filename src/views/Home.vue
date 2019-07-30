<template>
  <div class="home">
  	<h5>后台主页</h5>
  	<div>
  		<router-link to="/classManage">班级管理</router-link>
  		<router-link to="/studentManage">学生管理</router-link>
  		<router-link to="/teacherManage">老师管理</router-link>
  		<!-- <router-link to="/manage/changePassword">修改密码</router-link> -->
  		<router-link to="/makePaper">老师出卷</router-link>
  		<router-link to="/maintain">试卷维护</router-link>
  		<router-link to="/arrangeTest">安排考试</router-link>
  		<router-link to="/readPapers">批阅试卷</router-link>
  		<router-link to="/studentGrade">学生成绩</router-link>
  	</div>
  	<router-view/>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home'
}
</script>
