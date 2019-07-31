<template>
	<div class="about">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="账号" prop="name">
				<el-input v-model="ruleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input  type="password" v-model="ruleForm.password"></el-input>
			</el-form-item>
			<el-form-item prop="type">
				<el-checkbox-group v-model="ruleForm.checked ">
					<el-checkbox label="记住密码" name="checked "></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')" logining>登陆</el-button>
				<el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Cookie from '../util/Cookie'
import Base64 from '../util/Base64'
export default {
	data() {
		return {
			ruleForm: {
				logining:false,//登陆状态
				name: '',//账号
				password:'',//密码
				checked : false,//记住密码
			},
			rules: {
				name: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
				password:[{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		submitForm(formName) {
			// var that = this;
			this.logining = true;//登陆状态
			//var loginParams = { username: this.ruleForm.name, password: this.ruleForm.password};//获取表中数据
			this.axios.get('/api/OAuth/authenticate',{
				params:{
					userMobile: this.ruleForm.name,
					userPassword: this.ruleForm.password,
				}
			}).then((res)=>{
				console.log(res.data)
				if(code == '200'){
					 console.log("登陆成功");
					//跳转到后台主界面
					this.$router.push({ path: '/home' });
				}else{
					this.$message({
					message: msg,
					type: 'error'
				});
			}
			}).catch((err) => {
					console.log(err)
			})
		},
		//设置Cookie
		
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
}
</script>

<style scoped="scoped">
	.el-form{
		position: absolute;
		left: 40%;
		padding-top: 2%;
		background-color: #DDDDDD;
	}
	.demo-ruleForm{
		position: absolute;
		top: 30%;
	}
	.el-input{
		width: 80%;
	}
</style>
