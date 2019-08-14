<template>
	<div id="home">
		<el-container>
			<!-- 侧边栏  -->
			<el-aside width="auto">
				<el-menu
				:default-active="$route.path"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				:collapse="isCollapse"
				:collapse-transition="false"
				active-text-color='#29A88D'
				background-color="#272D34"
				router
				text-color="#fff"
				:default-openeds="['1','2']">
				<el-menu-item>
					<img src="../assets/log.png" class="logo" />
					<span solt="title" style="color: white;font-size: 20px;">智学无忧</span>
				</el-menu-item>
					<el-submenu
					v-for="(item,index) in modules"
					:key="index"
					:index="++ index+'' ">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span style="font-size:16px;">{{item.title}}</span>
						</template>
						<el-menu-item-group>
							<el-menu-item
							:index="value.lpath"
							v-for="(value,num) in item.list"
							:key="num"
							@click="handleTab(value)">{{value.name}}</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container class="content">
				<el-header>
					<div v-model="isCollapse" style="margin-bottom: 20px;" class="el-icon">
						<i @click="unfold" class="el-icon-s-fold" id="ic"></i>
						<i @click="unfold" class="el-icon-s-unfold" id="icon" style="display: none;"></i>
					</div>
					<!-- tab标签 -->
					<el-tabs
					v-model="editableTabsValue"
					type="card"
					@tab-remove="removeTab"
					@tab-click="clickTab">
						<el-tab-pane
						v-for="(item, index) in editableTabs"
						:key="item.name"
						:label="item.title"
						:name="item.name"
						:closable="index>0">
							{{item.content}}
						</el-tab-pane>
					</el-tabs>
					<el-dropdown style="width:100px">
						<i class="el-icon-user-solid" style="margin-right: 15px"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>个人中心</el-dropdown-item>
							<el-dropdown-item>消息</el-dropdown-item>
							<el-dropdown-item @click.native="handHomeout()">退出</el-dropdown-item>
						</el-dropdown-menu>
						<span>{{user}}</span>
					</el-dropdown>
				</el-header>
				<el-main>
					<router-view/>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: "home",
		data() {
			return {
				isCollapse: false, //默认不折叠
				user:'',
				storage:[],//存储数组
				editableTabsValue: '', //定义tags标签页数据
				editableTabs: [{ //定义新的标签数据
					title: '首页',
					name: '/home'
				}],
				tabIndex: 1,
				modules: [ //动态数组数据
					{
						title: "在线测试",
						path: "/home/test",
						list: [
							{name: "老师出卷",lpath: "/makePaper"},
							{name: "试卷维护",lpath: "/maintain"},
							{name: "安排考试",lpath: "/arrangeTest"},
							{name: "批阅试卷",lpath: "/readPapers"},
							{name: "学生成绩",lpath: "/studentGrade"}
						]
					},
					{
						title: "基础数据",
						path: "/home/manage",
						list: [
							{name: "班级管理",lpath: "/classManage"},
							{name: "学生管理",lpath: "/studentManage"},
							{name: "老师管理",lpath: "/teacherManage"},
							{name: "修改密码",lpath: "/changePassword"},
							{name: "用户角色",lpath: "/userRole"}
						]
					}
				]
			}
		},
		/**
		 * 创建后刷新保存
		 */
		 created() {
			let th = this;
			th.modules.forEach(item => {
				item.list.forEach(item => {
				th.storage.push(item);
				});
			});
		//console.log(_this.asideTionList)
			var getTabList = JSON.parse(sessionStorage.getItem("editableTabs")); //得到存储的tab内容
			var getTabName = sessionStorage.getItem("TabName"); //得到存储的tab位置name
			if (getTabList && getTabName) {
			//如果存在sessionStorage数据,改变其结果
			th.editableTabs = getTabList;
			th.editableTabsValue = getTabName;
			}
			//当userName存在时，获取user
			if (sessionStorage.getItem('userName')) {
				th.user = sessionStorage.getItem('userName')
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				//console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				//console.log(key, keyPath);
			},
			/**
			 * 侧边栏收缩展开需要修改
			 */
			unfold() {
				let ic = document.getElementById("ic")
				let icon = document.getElementById("icon")
				this.isCollapse = !this.isCollapse
				if (this.isCollapse) {
					ic.style.display = "none"
					
					icon.style.display = "block"
				 } else {
					ic.style.display = "block"
					icon.style.display = "none"
				}
			},
			/**
			 * 侧边栏添加打开tab标签
			 */
			handleTab(value) {
				//console.log(value)
				var exist = false;
				var t = this;
				for (var i = 0; i < t.editableTabs.length; i++) {
					if (value.name == t.editableTabs[i].title) {
						exist = true;
						break;
					}
				}
				if (exist == true) {//如果名字相同就跳路由回去
					t.editableTabsValue = value.lpath;
					return;
				}
				t.editableTabs.push({
					title: value.name,
					name: value.lpath,
				});
				t.editableTabsValue = value.lpath;
				sessionStorage.setItem(
				    "editableTabs",
				    JSON.stringify(this.editableTabs)
				  ); //添加存储用户操作的tab内容
				  sessionStorage.setItem("TabName", value.lpath); //存储menu.routers,这里需要的是editableTabs数组中name
				
			},
			/**
			 * tab标签跳转子路由
			 */
			clickTab(name) {
				//console.log(name)
				var that = this;
				//遍历modules数组
				for (var m = 0; m < that.modules.length; m++) {
					//遍历list数组
					for (var n = 0; n < that.modules[m].list.length; n++) {
						var ser = that.modules[m].list;//获取modules中的list数据
						//console.log(ser)
						if (ser[n].name == name.label) {//当侧边栏的name等于tab的name时
							//console.log(ser[n])
							that.$router.push(ser[n].lpath);
							sessionStorage.setItem("TabName",ser[n].lpath);
						}
					}
				}
			},
			/**
			 * 关闭标签
			 */
			removeTab(targetName) {
				var _this = this
				if (targetName == "/home") {
					return
				}
				let tabs = _this.editableTabs;
				let activeName = _this.editableTabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								console.log(activeName)
								activeName = nextTab.name;
							}
						}
					});
				}
				_this.$router.push(activeName);//跳转路由
				_this.editableTabsValue = activeName;
				_this.editableTabs = tabs.filter(tab => tab.name !== targetName);
				sessionStorage.setItem("editableTabs", JSON.stringify(_this.editableTabs));//缓存
				sessionStorage.setItem("TabName", activeName); 
			},
			/**
			 * 退出登录
			 */
			handHomeout(){
				 var _this = this;
				_this.$confirm("确认退出吗, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					sessionStorage.clear(); //清除缓存
					_this.$router.push("/"); //重新跳转
				}).catch(() => {
					_this.$message({
					type: "info",
					message: "已取消退出"
				});
				});
			}
		}
	}
</script>

<style scoped lang="less">
	// #home{
	// 	width: 100%;
	// }
	.el-aside{
		background-color: rgb(255, 255, 255);
		// height:100%;
	}
	.content{
		width: 80%;
	}
	.el-icon i{
		font-size: 50px;  
	}
	/deep/.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 625px;
	}
	.el-menu--collapse{
		height: 625px;
		width: 75px;
	}
	.logo {
		height: 50px;
		// margin-right: 10px;
		vertical-align: middle;
	}
	/deep/.el-menu-item-group__title{
		padding:0px;
	}
	.el-header {
		// width: 100%;
		display: flex;
		justify-content: space-between;
		 margin-top: 10px;
	}
	.el-tabs{
		flex: 1;
		width: 100%;
	}
	// /deep/.el-tabs__item{
	// 	font-size: 16px;
	// }
	// .el-tab-pane{
	// 	overflow: hidden;
	// }
	.el-dropdown {
		font-size: 18px;
	}
</style>
