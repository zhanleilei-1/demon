<template>
	<div id="home-class">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础数据</el-breadcrumb-item>
			<el-breadcrumb-item>班级管理</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 内容 -->
		<el-card class="box-card">
			<div>
				<el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addClass()">新 增</el-button>
			</div>
			<br>
			<el-table :data="tableData" style="width: 100%;text-align: center;">
				<el-table-column prop="className" label="班级名称" width="150"></el-table-column>
				<el-table-column prop="userName" label="老师名称" width="150"></el-table-column>
				<el-table-column prop="courseName" label="专业名称" width="150"></el-table-column>
				<el-table-column prop="classStudents" label="班级人数" width="150"></el-table-column>
				<el-table-column label="班级创建日期" >
					<template slot-scope="scope">
						{{scope.row.classCreateTime | formatDate}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--修改界面和新增界面同一个界面-->
			<el-dialog :title="editTitle?'增加班级':'修改班级'" :visible.sync="editFormVisible" width="35%" center>
				<el-form :model="form" :rules="rules" ref="form" label-width="80px">
					<el-form-item label="班级" prop="className">
						<el-input v-model="form.className" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="课程" prop="courseName">
						<el-select v-model="form.courseName" placeholder="请选择课程" @change="changeCourse()">
							<el-option
							v-for="item in courseData"
							:key="item.classCourseId"
							:value="item.courseName">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="老师" prop="userName">
						<el-select v-model="form.userName" placeholder="请选择教师" @change="changeTeacher()">
							<el-option
							v-for="item in teacherData"
							:key="item.classTeacherId"
							:value="item.userName">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="resetForm('form')">取 消</el-button>
					<el-button type="primary" @click="submit?submitAdd('form'):submitUpdate('form')">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	import {formatDate} from "@/util/data.js";
	export default {
		data() {
			return {
				tableData: [], //信息数组
				teacherData: [], //老师信息数组
				courseData: [], //课程信息数组
				editFormVisible: false, //编辑新增页面显示隐藏
				editTitle: true, // true时,表单标题是增加班级;false标题是修改班级信息
				submit: true, //为true时,提交是增加班级的表单;false提交的是编辑班级的表单
				form: {
					classId: "", //班级编号
					className: "", //班级
					classTeacherId: "", //老师编号
					userName: "", //老师名字
					classCourseId: "", //专业编号
					courseName: "", //专业课程
					classStudents: "", //学生人数
					classCreateTime: "" //班级创建日期
				},
				rules: {
					className: [{
						required: true,
						message: "请输入班级名称",
						trigger: "blur"
					}],
					userName: [{
						required: true,
						message: "请选择教师",
						trigger: "blur"
					}],
					courseName: [{
						required: true,
						message: "请选择专业",
						trigger: "blur"
					}]
				}
			}
		},
		/**
		 * 创建获取数据方法
		 */
		created() {
			this.getMsg(); //获取tableData数据
			this.getTeacher(); //获取老师数据
			this.getCourse(); //获取班级数据
		},
		methods: {
			/**
			 * 获取班级的数据
			 */
			getMsg() {
				var that = this;
				that.axios.get('/api/Class/GetAllClass').then((res) => {
					//console.log(res.data)
					that.tableData.push(...res.data) //...表示展开数组
					//console.log(that.tableData)
				}).catch(err => {
					console.log(err);
				});
			},
			/**
			 * 获取老师信息
			 */
			getTeacher() {
				var that = this;
				that.axios.get('/api/User/GetTeachers', ).then((res) => {
					that.teacherData = res.data
					//console.log(res)
				}).catch(err => {
					console.log(err);
				});
			},
			/**
			 * 获取课程数据
			 */
			getCourse() {
				var that = this;
				that.axios.get('/api/Class/GetAllCourse', ).then((res) => {
					that.courseData = res.data
					//console.log(res)
				}).catch(err => {
					console.log(err);
				});
			},
			/**
			 * 获取下拉框专业信息
			 */
			changeCourse() {
				let that = this;
				let course = that.courseData.find(item => {
					return that.form.courseName == item.courseName;
				});
				that.form.classCourseId = course.courseId;
				// console.log(that.form.classCourseId);
			},
			/**
			 * 获取下拉框老师信息
			 */
			changeTeacher() {
				let that = this;
				let teacher = that.teacherData.find(item => {
					return that.form.userName == item.userName;
				});
				that.form.classTeacherId = teacher.userId;
				// console.log(that.form.userName)
			},
			/**
			 * 新增班级信息
			 */
			addClass() {
				let that = this;
				that.editFormVisible = true; //显示新增表单
				that.editTitle = true; //表单标题显示为增加班级
				that.submit = true; //让提交的表单是增加班级的表单
				//初始化表单信息:点击修改后点击新增，如果不初始化，弹框中会有数据
				that.form.classId = 0;
				that.form.className = "";
				that.form.classTeacherId = "";
				that.form.userName = "";
				that.form.classCourseId = "";
				that.form.courseName = "";
				that.form.classStudents = "";
				that.form.classCreateTime = "";
			},
			/**
			 * 提交增加班级的表单
			 * @param {Obj} form 表单对象 形参
			 */
			submitAdd(form) {
				let that = this;
				console.log(that.form.classCourseId);
				that.$refs[form].validate(valid => { //validate验证规则
					if (valid) {
						that.axios.post("/api/Class/AddClass", {
								className: that.form.className,
								classCourseId: that.form.classCourseId,
								classTeacherId: that.form.classTeacherId
							}).then(res => {
								console.log(res);
								res.data.data.userName = that.form.userName;
								res.data.data.courseName = that.form.courseName;
								that.tableData.unshift(res.data.data); //得到数据库返回的新增班级信息，并添加到表格中
								if (res.data.code == 1) {
									that.$message.success(res.data.message);
								}
							})
							.catch(err => {
								console.log(err);
							});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
				that.editFormVisible = false;
			},
			/**
			 * 编辑班级
			 *  @param {Object} row数据 
			 * @param {Number} index下标
			 */
			handleEdit(index, row) {
				var _this = this
				_this.editFormVisible = true //表单弹出
				console.log(row)
				_this.form.className = row.className; //班级名称
				_this.form.courseName = row.courseName; //专业名称
				_this.form.userName = row.userName; //老师名字
			},
			/**
			 * 提交修改班级的表单
			 * @param {Obj} form 表单对象 形参
			 */
			submitUpdate(form) {
				let that = this;
				that.$refs[form].validate(valid => {
					if (valid) {
						that.axios
							.post("Class/ModifyClass", {
								classId: that.form.classId, //要修改的班级主键
								className: that.form.className, //要修改的班级名称
								classCourseId: that.form.classCourseId, //课程编号
								classTeacherId: that.form.classTeacherId //老师编号
							})
							.then(res => {
								// console.log(res);
								//更改的数据实时更新到表格中
								that.tableData[that.index].className = that.form.className;
								that.tableData[that.index].courseName = that.form.courseName;
								that.tableData[that.index].userName = that.form.userName;
								switch (res.data.code) {
									case -1:
										that.$message.danger(res.data.message);
										break;
									case -2:
										that.$message.danger(res.data.message);
										break;
									case 0:
										that.$message.info(res.data.message);
										break;
									default:
										that.$message.danger(res.data.message);
								}
								that.$message.success(res.data.message);
							})
							.catch(err => {
								console.log(err);
							});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
				that.dialogFormVisible = false;
			},
			/**
			 * 删除班级
			 *  @param {Object} row数据 
			 * @param {Number} index下标
			 */
			handleDelete(index, row) {
				// console.log(row)
				// console.log(row.classId)
				var t = this;
				var classStudents = row.classStudents
				if (classStudents == 0) {
					t.$confirm('确定要删除?', '修改提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//that.$message.success("删除成功")
						t.axios.get('/api/Class/RemoveClass', {
							params: { //当端口班级id等于table班级id
								classId: row.classId
							}
						}).then((res) => {
							//返回格式：
							// {code:0,返回代码 0：没有改变 1：成功 -1：系统异常 -2：参数错误 除此之外就是其它错误
							//msg:"",消息 data:"",操作成功后，返回给前端有用的数据}
							console.log(res.data)
							//console.log(res)
							if (res.data.code = 1) {
								t.tableData.splice(index, 1) //删除端口中的数据
								t.$message.success("删除成功")
							}
						})
					}).catch(() => {
						t.$message.info("已取消删除")
					});
				} else { //禁用
					//that.disabled
					t.$message.info("该班有学生就读无法删除")
				}
			}
		},
		//日期时间转换函数
		filters: {
			formatDate(time) {
				console.log(111)
				var date = new Date(time);
				return formatDate(date, "yyyy-MM-dd hh:mm");
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
	.text {
		font-size: 14px;
	}
	.item {
		padding: 18px 0;
	}
	.box-card {
		width: 1000px;
	}
	// /deep/.el-table td {
	// 	padding: 0px;
	// }
	/deep/.el-dialog--center .el-dialog__body {
		text-align: center;
	}
</style>
