<template>
  <div id="app">
   <!-- <div id="nav"> -->
			<!-- <router-link to="/">登陆</router-link>|
			<router-link to="/home">后台主页</router-link> -->
    <!-- </div> -->
			<router-view/>
  </div>
</template>

<style lang="less">
	body{
		margin: 0px;
		padding: 0px;
	}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
