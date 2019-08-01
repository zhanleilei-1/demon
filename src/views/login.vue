<template>
	<div id="login">
		<div class="about">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<h2>用户登录</h2>
				<el-form-item label="账号" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input  type="password" v-model="ruleForm.password"></el-input>
				</el-form-item>
				<el-checkbox label="记住密码" v-model="checked " name="checked "></el-checkbox>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')" logining>登陆</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Cookie from '../util/Cookie'
import Base64 from '../util/Base64'
export default {
	data() {
		return {
			checked : false,//记住密码
			ruleForm: {
				logining:false,//登陆状态
				name: '',//账号
				password:''//密码
				
			},
			rules: {//规则
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
		}
	},
	created(){
		if(Cookie.getCookie("name") && Cookie.getCookie("password")){//当cookie中有值时
			this.checked=true;
			this.ruleForm.name = Base64.decode(Cookie.getCookie("name"));
			console.log(Cookie.getCookie("name"))
			this.ruleForm.password = Base64.decode(Cookie.getCookie("password"));
		}
	},
	methods: {
		submitForm(formName) {
			var that = this;
			that.logining = true;//登陆状态
			that.axios.get('/api/OAuth/authenticate',{
				params:{
					userMobile: that.ruleForm.name,
					userPassword: that.ruleForm.password,
				},
			}).then((res)=>{
				that.logining = false;
				that.$router.push('/home' );
				that.$message.success("登录成功");
				that.cache();//调用cache()方法
			}).catch((err) => {
				that.logining = false;
				that.$message({
					message: '账户密码错误',
					type: 'error'
				});
			})
		},
		 //判断复选框是否被勾选 勾选则调用配置cookie方法
		cache(){
			if (this.checked == true) {
				console.log("checked == true");
				let name = Base64.encode(this.ruleForm.name);//加密
				let password = Base64.encode(this.ruleForm.password);
				//传入账号名，密码，和保存天数3个参数
				Cookie.setCookie("name", name,{maxAge:60*60*24*30});
				Cookie.setCookie("password", password, {maxAge:60*60*24*30});
			}else {
				console.log("清空Cookie");
				//清空Cookie
				Cookie.removeCookie("name");
				Cookie.removeCookie("password");
				
			}
		},
		//重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
}
</script>

<style scoped lang="less">
	.about{
		width: 100%;
		height: 625px;
		background-image: url(../assets/bj.jpg);
		background-size: cover;
	}
	.el-form{
		width: 30%;
		position: absolute;
		left: 37%;
		background-color: white;
	}
	h2{
		text-align: center;
	}
	.demo-ruleForm{
		position: absolute;
		top: 25%;
	}
	.el-input{
		width: 80%;
	}
	.el-checkbox{
		margin-left: 25%;
		margin-bottom: 5%
	}
</style>
