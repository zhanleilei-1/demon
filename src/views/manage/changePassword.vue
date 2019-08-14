<template>
	<div id="home-change">
		<h2 style="text-align: center;">修改密码</h2>
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="旧密码" prop="oldPass">
				<el-input type="text" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="pass">
				<el-input type="text" v-model="ruleForm.pass" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass">
				<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				<el-button @click="resetForm('ruleForm')">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>


<script>
	export default {
		data() {
			//旧密码非空验证
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入旧密码'));
				} else {
					callback();
				}
			};
			//新密码验证
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			//确认密码验证
			var validatePass3 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: '', //新密码
					checkPass: '', //再次输入新密码
					oldPass: '' //旧密码
				},
				rules: {
					pass: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					checkPass: [{
						required: true,
						validator: validatePass3,
						trigger: 'blur'
					}],
					oldPass: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			/**
			 * 保存
			 * @param {string} formName表单输入框的value 
			 */
			submitForm(formName) {
				// console.log(formName)
				var that = this
				that.$refs[formName].validate((valid) => {
					if (valid) {
						//alert('submit!');
						that.$confirm('是否继续修改密码?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								that.axios.get('/api/User/ModifyPassword', {
											params: {
												uid: sessionStorage.getItem("userUid"),
												oldPassword: that.ruleForm.oldPass,
												newPassword: that.ruleForm.pass
											}
										}).then((res) => {
											//console.log(res.data)
											//code=0 数据没有任何变化 code=1 成功  code=-1 系统异常   code=-2 参数错误   code=其它错误 
											switch (res.data.code) {
												case 1:
													that.$message.success('修改成功!')
													sessionStorage.removeItem("token"); //清除令牌
													sessionStorage.removeItem("uid"); //清除id
													that.$router.replace("/") //成功后跳转到首页
													break;
												case 0:
													that.$message.info('数据没有变化')
													break;
												case -1:
													that.$message.warning('系统异常')
													break;
												case -2:
													that.$message.error('参数错误')
													break;
												default:
													that.$message.warning(res.data.message)
													break;
											}
											}).catch((err) => {
											that.$message.error("修改密码失败");
										})
							}).catch(()=> {
											that.$message.info("已取消修改")
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			/**
			 * 取消
			 * @param {string} formName表单输入框的value 
			 */
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped lang="less">
</style>
