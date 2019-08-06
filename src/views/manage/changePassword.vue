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
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入旧密码'));
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else if (value == this.ruleForm.oldPass) {
					callback(new Error('该密码与原密码一致!'));
				} else {
					callback();
				}
			};
			var validatePass3 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					console.log(111)
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
						validator: validatePass2,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass3,
						trigger: 'blur'
					}],
					oldPass: [{
						validator: validatePass,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			/**
			 * 保存
			 */
			submitForm(formName) {
				var that = this
				// console.log(111)
				console.log()
				that.axios.get('/api/User/ModifyPassword', {
					params: {
						uid: sessionStorage.getItem("userUid"),
						oldPassword: that.ruleForm.oldPass,
						newPassword: that.ruleForm.pass
					}
				}).then((res) => {
					//console.log(res)
					that.$confirm('是否继续修改密码?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						that.$message.success('修改成功!')
						//修改成功后3秒后跳转到登录页面
						if(res.data.code == 1){
							that.$message({
								message: "密码已被修改,请重新登入",
								type: 'success'
							});
							setTimeout(function() {
							that.$router.replace("/"); //成功后跳转到首页
						}, 2000);
						}
						}).catch(() => {
							that.$message({
								type: 'info',
								message: '已取消修改'
							});
					});
				}).catch((err) => {
					that.$message.err("修改密码失败");
				});
			},
			/**
			 * 取消
			 */
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped lang="less">
</style>
