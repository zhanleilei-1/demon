<template>
	<div id="home-teacherManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础数据</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-radio-group v-model="radio" @change="tableData = tableFilter">
					<el-radio
					v-for="item in roleData"
					:label="item.userTypeTypeName"
					:key="item.userTypeId"
					:value="item.userTypeId"></el-radio>
				</el-radio-group>
			<el-button class="btn" type="primary" size="small" icon="el-icon-circle-plus-outline" @click="add">新 增</el-button>
			<el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%;text-align: center;">
				<el-table-column prop="userUserTypeId" label="编号" sortable width="120"></el-table-column>
				<el-table-column prop="userName" label="老师名称" sortable width="150"></el-table-column>
				<el-table-column prop="userSex" label="性别" sortable width="100"></el-table-column>
				<el-table-column prop="userMobile" label="手机号" sortable width="180"></el-table-column>
				<el-table-column prop="userPassword" label="密码" sortable width="150"></el-table-column>
				<el-table-column prop="userTypeTypeName" label="角色" sortable width="150"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 新增和编辑弹框 -->
		<el-button type="text" @click="dialogFormVisible = true"></el-button>
		<el-dialog :title="formValue?'编辑':'增 加'" :visible.sync="dialogFormVisible" classCourseId="el-dialog" width="35%" center>
			<el-form :model="form" :rules="rules">
				<el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
					<el-input v-model="form.userName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="userMobile" :label-width="formLabelWidth">
					<el-input v-model="form.userMobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="userPassword" :label-width="formLabelWidth">
					<el-input v-model="form.userPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="userSex" :label-width="formLabelWidth">
					<el-radio-group v-model="form.userSex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="选择角色" prop="userTypeTypeName" :label-width="formLabelWidth">
					<el-select v-model="form.userTypeTypeName" placeholder="请选择" @change="selectTypeName">
						<el-option v-for="(item,index) in roleName" :key="index" :value="item.userTypeTypeName">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="formValue?submitUpdate():submitAdd()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				radio: "全部", //单选
				tableData: [],//老师数据
				filterData:[],//过滤老师数据新数组
				roleName: [],//角色
				dialogFormVisible: false,//弹框的隐藏
				formValue: false,//增加和编辑标题
				formLabelWidth: '80px',//选择框长度
				form: {
					index: "",//下标
					userUid: '',//编号
					userName: '', //用户名
					userMobile: "", //手机号
					userSex: "", //性别
					userPassword: '',//密码
					userTypeTypeName: "", //角色
					userUserTypeId: 0//角色编号
				},
				roleData:[
					 {disable: true,userTypeId: 0,userTypeTypeName: "全部"}
				],//radio数组
				rules: {//表单验证提示信息
					userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
					userMobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ min: 11, max: 11, message: '手机号长度11位', trigger: 'blur' }],
					userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度6~18', trigger: 'blur' }]
				}
			}
		},
		created() {
			this.array();
			this.user();
		},
		methods: {
			/**
			 * 老师信息数据
			 * */
			array() {
				var that = this;
				that.axios.get('/api/User/GetTeachers').then((res) => {
					//console.log(res)
					that.tableData = res.data;
					that.filterData = res.data//过滤后的老师数组
				})
			},
			/**
			*角色数据
			*/
			user() {
				var that = this;
				that.axios.get('/api/UserType/GetUserRoles').then((res) => {
					//console.log(res)
					that.roleName = res.data;
					that.roleData.push(...res.data);//过滤后的角色数组
				})
			},
			/**
			 * 角色下拉框信息
			 */
			selectTypeName(userTypeTypeName) {
				var that = this;
				let index = that.roleName.findIndex(item => item.userTypeTypeName == userTypeTypeName);
				that.form.userUserTypeId = that.roleName[index].userTypeId;
				//console.log(that.form.userUserTypeId, that.roleName[index].userTypeId)
			},
			/**
			 * 增加老师
			 */
			add() {
				let that = this;
				that.formValue = false;//增加老师
				that.dialogFormVisible = true;//弹框显示
				//数据初始化
				that.form.userUid = '';
				that.form.userName = '';
				that.form.userMobile = "";
				that.form.userSex = "";
				that.form.userPassword = "";
				that.form.userTypeTypeName = "";
				that.form.userUserTypeId = "";
				that.form.index = 0;
			},
			/**
			*提交新增老师信息
			*/
			submitAdd() {
				var that = this;
				that.dialogFormVisible = false;
				that.$confirm("您确定新增吗, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						that.axios.post("/api/User/AddTeacher", {
								userName: that.form.userName,
								userMobile: that.form.userMobile,
								userSex: that.form.userSex,
								userPassword: that.form.userPassword,
								userUserTypeId: that.form.userUserTypeId
							}).then(res => {
								//console.log(res)
								let data = res.data.data;
								if (res.data.code == 1) {
									data.userTypeTypeName = that.form.userTypeTypeName;
									that.tableData.unshift(data);
									that.$message({
										message: "增加成功",
										type: "success"
									});
								}
							})
							.catch(error => {
								console.log(error);
							})
					})
			},
			/**
			*编辑老师信息
			*/
			handleEdit(index, row) {//将本行数据赋值
				//console.log(index, row);
				var that = this;
				that.formValue = true;//修改老师
				that.dialogFormVisible = true;//弹框显示
				that.form.userUid = row.userUid;
				that.form.userName = row.userName;
				that.form.userSex = row.userSex;
				that.form.userMobile = row.userMobile;
				that.form.userPassword = row.userPassword;
				that.form.userTypeTypeName = row.userTypeTypeName;
				that.form.userUserTypeId = row.userUserTypeId;
				that.form.index = index;
			},
			/**
			*提交修改老师信息
			*/
			submitUpdate() {
				var that = this;
				that.editFormVisible = false;
				that.$confirm("您确定修改吗, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						that.axios.post("/api/User/ModifyTeacher", {
								userUid: that.form.userUid, //要修改的用户标识符
								userName: that.form.userName, //修改名称
								userMobile: that.form.userMobile, //要修改的手机号，11位手机号
								userSex: that.form.userSex, //要修改的性别，男|女
								userUserTypeId: that.form.userUserTypeId,//角色
								userPassword: that.form.userPassword//密码
							}).then(res => {
								//console.log(res)
								if (res.data.code == 1) {
									let index = that.form.index;//重新赋值
									that.tableData[index].userUid = that.form.userUid;
									that.tableData[index].userName = that.form.userName;
									that.tableData[index].userMobile = that.form.userMobile;
									that.tableData[index].userSex = that.form.userSex;
									that.tableData[index].userTypeTypeName = that.form.userTypeTypeName;
									that.tableData[index].userPassword = that.form.userPassword;
									that.dialogFormVisible = false;
									that.$message.success("修改成功");
								}
							}).catch(error => {
								that.$message({
									message: "修改失败",
									type: "error"
								});
								console.log(error);
								that.dialogFormVisible = false;
							});
					});
			},
			/**
			*删除老师
			*@param {Object} row数据 
			 * @param {Number} index下标
			*/
			handleDelete(index, row) {
				console.log(index, row);
				var that = this;
				that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.axios.post('/api/User/RemoveTeacher?uid=' + that.tableData[index].userUid)
						.then((res) => {
							//console.log(res)
							if (res.data.code == 1) {
								that.$message({
									type: 'success',
									message: '删除成功!'
								})
								that.tableData.splice(index, 1)//成功则删除
							} 
						})
				}).catch(() => {
					that.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		computed:{//用来监控自己定义的变量,可以在页面上进行双向数据绑定展示出结果或者用作其他处理
			//必须有返回值
			tableFilter(){
				let _this = this;
				if (_this.radio == _this.roleData[0].userTypeTypeName) {
					return _this.filterData;
				}
				return _this.filterData.filter(
					value => value.userTypeTypeName == _this.radio
				);
			}
		}
	}
</script>

<style scoped lang="less">
	.el-card{
        margin-top: 20px;
    }
	/deep/.el-breadcrumb {
		font-size: 15px;
	}
	.el-radio-group {
		height: 50px;
	}
	.el-radio {
		line-height: 50px;
	}
	.btn {
		position: absolute;
		right: 50px;
	}
</style>
