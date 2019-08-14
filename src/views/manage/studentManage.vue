<template>
	<div id="home-studentManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础数据</el-breadcrumb-item>
			<el-breadcrumb-item>学生管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<template>
				<el-select v-model="select.className" filterable placeholder="请选择" @change=" searchClass">
					<el-option v-for="item in classData" :key="item.classId" :value="item.className">
					</el-option>
				</el-select>
			</template>
			<el-button style="float: right; padding: 3px 0" type="text" @click="addTab">新增</el-button>
			<el-table :data="tableData"  :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%">
				<el-table-column type='index' prop="classId" label="编号" sortable width="80"></el-table-column>
				<el-table-column prop="stuName" label="学生名称" sortable width="120"></el-table-column>
				<el-table-column prop="stuMobile" label="手机号" sortable width="150"></el-table-column>
				<el-table-column prop="stuPassword" label="密码" sortable width="130"></el-table-column>
				<el-table-column prop="stuSex" label="性别" sortable width="80"></el-table-column>
				<el-table-column prop="className" label="班级名称" sortable width="120"></el-table-column>
				<el-table-column label="生日" width="150">
					<template slot-scope="scope">
						<i class="el-icon-time"></i><span>{{ scope.row.stuBirthDay | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 新增 编辑表单 -->
		<el-button type="text" @click="dialogFormVisible = true"></el-button>
		<el-dialog :title="formValue?'编辑':'增 加'" :visible.sync="dialogFormVisible" classCourseId="el-dialog">
			<el-form :model="form" :rules="rules">
				<el-form-item label="学生姓名" prop="stuName" :label-width="formLabelWidth">
					<el-input v-model="form.stuName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="生日" required :label-width="formLabelWidth">
					<el-col :span="11">
						<el-form-item prop="stuBirthDay">
							<el-date-picker type="date" placeholder="选择日期" v-model="form.stuBirthDay"
								style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="手机号" prop="stuMobile" :label-width="formLabelWidth">
					<el-input v-model="form.stuMobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录密码" prop="stuPassword" :label-width="formLabelWidth">
					<el-input v-model="form.stuPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="stuSex" :label-width="formLabelWidth">
					<el-radio-group v-model="form.stuSex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="班级编号" prop="className" :label-width="formLabelWidth">
					<el-select v-model="form.className" placeholder="请选择" @change="selectClassId">
						<el-option v-for="(item,index) in classData" :key="index" :value="item.className"></el-option>
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
	import {formatDate} from "@/util/data.js";
	export default {
		data() {
			return {
				classData: [],//搜索班级数据
				tableData: [],//表格数据接受
				dialogFormVisible: false,//弹框的显示
				formValue: false,//选择编辑或添加
				formLabelWidth: '100px',
				select: {
					className: "", //班级名称
					classId: "" //班级编号
				},
				form: {//弹框数据
					index: 0,
					stuName: '',//学生姓名
					stuUid: '',//学生的唯一标识符
					stuBirthDay: '',//生日
					stuClassId: '',//班级编号
					stuMobile: '',//手机号
					className: '',//班级名称
					stuPassword: '',//密码
					stuSex: ''//性别
				},
				rules: {//表单验证提示信息
					stuName: [
						{ required: true, message: '学生姓名不能为空', trigger: 'blur' }
					],
					stuSex: [
						{ required: true, message: '请选择性别', trigger: 'blur' }
					],
					className: [
						{ required: true, message: '请选择班级', trigger: 'blur' }
					],
					stuBirthDay: [
						{ required: true, message: '请选择日期', trigger: 'blur' }
					],
					stuMobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ min: 11, max: 11, message: '手机号长度11位', trigger: 'blur' }
					],
					stuPassword: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度6~18', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			var that = this;
			that.getStudent();
			that.class();
		},
		methods: {
			/**
			 * 学生信息数据
			 * */
			getStudent() {
				var that = this;
				let classId = that.select.classId;
				if (classId) {
					that.axios.get('/api/Student/GetClassStudent', {
						params: {
							classId: classId
						}
					}).then((res) => {
						//console.log(res)
						that.tableData = res.data;//将数据赋值到tableData【】里
					})
				}
			},
			/**
			 * 班级数据
			 * */
			class() {
				var that = this;
				that.axios.get('/api/Class/GetAllClass').then((res) => {
					//console.log(res)
					that.classData = res.data;
					that.select.className = that.classData[0].className;
					that.searchClass(that.select.className);
				})
			},
			/**
     		* 搜索框班级信息
     		*/
			searchClass(className) {
				let that = this;
				let index = that.classData.findIndex(
					item => item.className == className
				);
				that.select.classId = that.classData[index].classId;
				that.getStudent();
			},
			/**
			 *弹框班级信息
			 */
			selectClassId(className) {
				let that = this;
				let index = that.classData.findIndex(item => item.className == className);
				//findIndex默认去遍历数组集合，将集合中的每个元素传入到function的item里，
				return that.form.stuClassId = that.classData[index].classId;
			},
			/**
			 * 新增
			 */
			addTab() {
				let that = this;
				that.formValue = false;//代表添加
				that.dialogFormVisible = true;//弹框打开
				//数据初始化
				that.form.stuUid = '';
				that.form.stuName = '';
				that.form.className = '';
				that.form.stuBirthDay = "";
				that.form.stuClassId = "";
				that.form.stuMobile = "";
				that.form.stuPassword = "";
				that.form.stuSex = "";
				that.form.index = 0;
			},
			/**
			*提交新增学生信息
			*/
			submitAdd() {
				var that = this;
				that.dialogFormVisible = false;
				that.$confirm("您确定添加吗, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						that.axios.post("/api/Student/AddStudent", {
								stuName: that.form.stuName,
								stuClassId: that.form.stuClassId,
								stuMobile: that.form.stuMobile,
								stuBirthDay: that.form.stuBirthDay,
								stuPassword: that.form.stuPassword,
								stuSex: that.form.stuSex
							}).then(res => {
								let data = res.data.data;
								//console.log(res)
								if (res.data.code == 1) {
									data.className = that.form.className;
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
			*编辑学生数据
			* @param {Object} row数据 
			 * @param {Number} index下标
			*/
			handleEdit(index, row) {//将数据赋值
				var that = this;
				that.formValue = true;//代表编辑
				that.form.stuUid = row.stuUid;
				that.form.stuName = row.stuName;
				that.form.className = row.className;
				that.form.stuBirthDay = row.stuBirthDay;
				that.form.stuClassId = row.classId;
				that.form.stuMobile = row.stuMobile;
				that.form.stuPassword = row.stuPassword;
				that.form.stuSex = row.stuSex;
				that.form.index = index;
				that.dialogFormVisible = true;//弹框打开
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
						that.axios.post("/api/Student/ModifyStudent", {
								stuUid: that.form.stuUid, // 要修改学生的唯一标识符
								stuName: that.form.stuName,//要修改的名称
								stuBirthDay: that.form.stuBirthDay, //要修改的生日
								stuClassId: that.form.stuClassId, //班级编号
								stuMobile: that.form.stuMobile,//要修改的手机号
								stuPassword: that.form.stuPassword,//要修改的密码
								stuSex: that.form.stuSex//要修改的性别
							}).then(res => {
								//console.log(res)
								if (res.data.code == 1) {
									let index = that.form.index;//重新赋值
									that.tableData[index].stuUid = that.form.stuUid;
									that.tableData[index].stuName = that.form.stuName;
									that.tableData[index].stuBirthDay = that.form.stuBirthDay;
									that.tableData[index].stuClassId = that.form.classId;
									that.tableData[index].stuMobile = that.form.stuMobile;
									that.tableData[index].stuPassword = that.form.stuPassword;
									that.tableData[index].stuSex = that.form.stuSex;
									that.tableData[index].className = that.form.className;
									that.dialogFormVisible = false;
									that.$message.success("修改成功");
								}
							}).catch(error => {
								that.$message({
									message: "修改失败",
									type: "error"
								});
								console.log(error);
								that.dialogFormVisible = false;//弹框关闭
							});
					});
			},
			/**
			*删除
			*@param {Object} row数据 
			 * @param {Number} index下标
			*/
			handleDelete(index, row) {
				var that = this;
				that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.axios.get('/api/Student/RemoveStudent', {
						params: {
							uid: that.tableData[index].stuUid
						}
					}).then((res) => {
						//console.log("删除状态", res)
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
		// 格式化时间
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd');
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
	.el-select{
		margin-left: 20px;
	}
</style>