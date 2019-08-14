<template>
	<div id="home-userRole">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础数据</el-breadcrumb-item>
			<el-breadcrumb-item>用户角色</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<div>
				<el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="add()">新 增</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="userTypeId" label="#" width="180"></el-table-column>
				<el-table-column prop="userTypeTypeName" label="角色" width="180"></el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button
						size="mini"
						@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)"
						:disabled="scope.row.disable">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!-- 新增界面 -->
		<el-dialog :title="editTitle?'增加角色':'修改角色'" :visible.sync="editFormVisible" width="35%" center>
			<el-form :model="form" :rules="rules" ref="form" label-width="80px">
				<el-form-item label="角色" prop="userRoleName">
					<el-input v-model="form.userTypeTypeName" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible=false">取 消</el-button>
				<el-button type="primary" @click="submit?submitAdd('form'):submitUpdate('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				editFormVisible: false, //编辑新增页面显示隐藏
				editTitle: true, // true时,表单标题是增加角色;false标题是修改角色信息
				disable:true,//是否禁用删除按钮
				tableData:[],//获取用户角色数据
				index:0,//当前选中下标
				form:{//新增角色
					userTypeTypeName:"",
					userTypeId:""
				},
				rules: {
					userTypeTypeName: [{
						required: true,
						message: "请输入角色",
						trigger: "blur"
					}]
				}
			}
		},
		/**
		 * 创建获取数据方法
		 */
		created(){
			this.getMsg();//获取tableData数据
		},
		methods:{
			/**
			 * 获取角色数据
			 */
			getMsg(){
				var that = this;
				that.axios.get('/api/UserType/GetUserRoles').then((res) => {
					// console.log(res)
					that.tableData.push(...res.data) //...表示展开数组
				}).catch(err => {
					console.log(err);
				});
			},
			/**
			 * 新增角色
			 */
			add(){
				this.editFormVisible = true; //显示增加表单
				this.editTitle = true; //表单标题显示为增加角色
				this.submit = true; //让提交的表单是增加角色的表单
				this.form.userTypeTypeName = "";//初始化
			},
			submitAdd(form){
				var that = this;
				//console.log(that.form.userTypeTypeName)
				that.$refs[form].validate(valid => {
					if (valid) {
						that.axios.post('/api/UserType/AddUserRole?userRoleName='+that.form.userTypeTypeName).then((res) => {
							console.log(res.data)
							res.data.data.userTypeTypeName = that.form.userTypeTypeName;
							that.tableData.unshift(res.data.data); //得到数据库返回的新增班级信息，并添加到表格中
							if (res.data.code == 1) {
								that.$message.success("添加角色成功");
							}
						}).catch(err => {
							console.log(err);
						});
					}else {
						console.log("error submit!!");
						return false;
					}
				});
				that.editFormVisible = false;
			},
			/**
			 * 编辑角色
			 * @param {Object} row数据 
			 * @param {Number} index下标
			 */
			handleEdit(index,row){
				var _this = this
				_this.editFormVisible = true //表单弹出
				_this.editTitle = false; //表单标题显示为修改角色
				_this.submit = false; //让提交的表单是修改角色的表单
				console.log(row)
				_this.form.userTypeTypeName = row.userTypeTypeName; //编辑时弹框中角色一开始选中的值
				_this.form.userTypeId = row.userTypeId; //编辑时弹框中角色的编号
				// console.log(row.userTypeId)
				_this.index = index;
			},
			/**
			 * 提交修改班级的表单
			 * @param {Obj} form 表单对象 形参
			 */
			submitUpdate(form) {
				var _this = this
				_this.axios.post('/api/UserType/ModifyUserRole?id='+_this.form.userTypeId + '&userRoleName='+_this.form.userTypeTypeName)
				.then((res) =>{
					// _this.form.userTypeTypeName = _this.tableData[_this.index].userTypeTypeName;
					_this.tableData[_this.index].userTypeTypeName=_this.form.userTypeTypeName
					console.log(_this.tableData[_this.index])
					_this.$message.success("修改成功")
				}).catch(err => {
					console.log(err);
				});
				_this.editFormVisible = false;
			},
			/**
			 * 删除角色
			 * @param {Object} row数据 
			 * @param {Number} index下标
			 */
			handleDelete(index,row){
				var _this = this
				_this.$confirm('确定要删除?', '修改提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.axios.post('/api/UserType/RemoveUserRole',null,{
						params:{
						userRoleId: row.userTypeId,
						}
					}).then((res) => {
						//console.log(res)
						if (res.data.code = 1) {
							_this.tableData.splice(index, 1) //删除端口中的数据
							_this.$message.success("删除成功")
						}
					})
				}).catch(() => {
						_this.$message.info("已取消删除")
					});
			}
		}
	}
</script>

<style scoped lang="less">
.box-card {
	width: 600px;
}
.el-card{
        margin-top: 20px;
    }
/deep/.el-breadcrumb {
	font-size: 15px;
}
</style>
