<template>
	<div id="home">
		<!-- <h5>后台主页</h5> -->
		<el-container>
			<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				<div>
					<img src="../assets/logo.png" class="logo" />
					<span>智学无忧</span>
				</div>
				<el-menu router text-color="#fff" :collapse="iscollapse" :collapse-transition="false" active-text-color='#29A88D'
				 background-color="#272D34">
					<el-submenu v-for="(item,index) in module" :key="index" :index="item.path">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>{{item.title}}</span>
						</template>
						<el-menu-item-group v-for="(value,num) in item.list" :key="num" @click="handleTab(module)">
							<el-menu-item :index="value.lpath">{{value.name}}</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container>
				<el-header>
					<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-add="addTab">
						<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
							{{item.content}}
						</el-tab-pane>
					</el-tabs>
					<el-dropdown>
						<i class="el-icon-user-solid" style="margin-right: 15px"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>个人中心</el-dropdown-item>
							<el-dropdown-item>消息</el-dropdown-item>
							<el-dropdown-item>退出</el-dropdown-item>
						</el-dropdown-menu>
						<span>张三</span>
					</el-dropdown>
				</el-header>
				<el-main>
					<router-view />
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
				iscollapse: false, //默认不折叠
				// openeds: ["/home/test", "/home/manage"],
				editableTabsValue: '', //定义tags标签页数据
				editableTabs: [{
					title: '首页',
					name: '1',
					content: 'Tab 1 content'
				}],
				tabIndex: 2,
				module: [ //动态数组数据
					{
						title: "在线测试",
						path: "/home/test",
						list: [{name: "老师出卷",lpath: "/makePaper"},
									{name: "试卷维护",lpath: "/maintain"},
									{name: "安排考试",lpath: "/arrangeTest"},
									{name: "批阅试卷",lpath: "/readPapers"},
									{name: "学生成绩",lpath: "/studentGrade"}]
					},
					{
						title: "基础数据",
						path: "/home/manage",
						list: [{name: "班级管理",lpath: "/classManage"},
									{name: "学生管理",lpath: "/studentManage"},
									{name: "老师管理",lpath: "/teacherManage"}]
					}]
			}
		},
		methods: {
			/**
			 * 侧边栏
			 */
			handleTab(module){
				var exist = false;
      for (var i = 0; i < this.editableTabs.length; i++) {
        if (module.name == this.editableTabs[i].name) {
          exist = true;
          break;
        }
      }
      if (exist == true) {
        this.editableTabsValue = module.name;
        return;
      }
      this.editableTabs.push({
        title: module.name,
        name: module.name,
        showItem: module.showItem,
        content: module.component
      });
      this.editableTabsValue = module.name;

			},
			/**
			 * 打开标签
			 */
			 addTab(targetName) {
				 console.log(targetName.label)
        // let newTabName = ++this.tabIndex + '';
        // this.editableTabs.push({
        //   title: 'New Tab',
        //   name: newTabName
        // });
        // this.editableTabsValue = newTabName;
      },
			/**
			 * 关闭标签
			 */
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
		// }
	}
</script>

<style scoped lang="less">
	.logo {
		width: 120px;
		margin-right: 10px;
	}
	.el-header{
		display:flex;
		justify-content:space-between;
		margin-top: 5px;
	}
	.el-dropdown{
		font-size: 20px;
	}
</style>
