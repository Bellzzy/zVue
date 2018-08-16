<template>
	<div class="login">
		<form class='login-body' @submit.prevent='submit'>
			<div class='head'>
				<span>曹操货的TMS后台管理系统</span>
			</div>
			<div class='body'>
				<h1>用户登录</h1>
				<el-input placeholder='请输入账户' v-model='login.userName' class='login-icon_input'></el-input>
				<el-input type='password' placeholder='请输入密码' v-model='login.password' class='login-icon_input'></el-input>
				<el-checkbox v-model="rememberPwd" true-label="1">记住密码</el-checkbox >
				<el-button type='primary' native-type='submit' class='login-icon_btn' 
					:loading='onLoading' :disabled='onLoading'>登&nbsp;&nbsp;录</el-button>
			</div>
		</form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			onLoading: false,
			login: {
				userName: '',
				password: ''
			},
			rememberPwd: ''
		}
	},
	methods: {
		submit(e) {
			if(this.onLoading) return;
			let usn = this.login.userName,
				pwd = this.login.password;
			if(/^\s*$/g.test(usn) || 'undefined' == typeof(usn)) {
				this.$message.error('帐户不能为空.');
				return;
			}
			if(/^\s*$/g.test(pwd) || 'undefined' == typeof(pwd)) {
				this.$message.error('密码不能为空.');
				return;
			}
			if('1' == this.rememberPwd) {
				localStorage.setItem('keyGen', this.login.userName+'#'+this.login.password+'#'+this.rememberPwd)
			} else {
				sessionStorage.removeItem('keyGen');
			}
			this.onLoading = !this.onLoading;
			this.axios.post('/user/usercontroller/login', this.login).then(res => {
				if(200 == res.code) {
					sessionStorage.setItem('token', res.data)
					this.$router.push({path:'/main', query: {link: 'home'}})
				} else {
					this.$message.error(res.msg)
				}
				this.onLoading = false;
			}).catch(() => {
				this.onLoading = false;
			})
			return false;
			
		}
	},
	mounted() {
		let keyGen = localStorage.getItem('keyGen');
		if(keyGen) {
			let arr = keyGen.split('#');
			this.login = {
				userName: arr[0],
				password: arr[1]
			}
			this.rememberPwd = arr[2];
		}
	}
}
</script>
<style lang="stylus">
.login
	height: 100%
	background: linear-gradient(to bottom right, #ffc784 , #1cbba7)
	background-size: cover
	text-align: center
	&:before 
		content: ' '
		height: 100%
		vertical-align: middle
		visibility: hidden
		display: inline-block
	.login-body
		width: 500px
		height: 400px
		vertical-align: middle
		display: inline-block
		text-align: left
		.head
			text-align: center
			span
				font-size: 30px !important
				text-align: center
				color: #fff
				line-height: 60px
			.logo
				display: inline-block
				vertical-align: middle
		.body
			background-color: #fff
			padding: 30px
			border-radius: 5px
			box-shadow:  0 10px 30px rgba(0,0,0,.5)
			h1 
				text-align: center
				font-weight: 500
				font-size: 18px !important
		.login-icon
			background-image: url('/static/imgs/login_ico.png')
			width: 40px
			height: 40px
			display: inline-block
		.login-icon_user
			background-position: -124px 9px
		.login-icon_pwd
			background-position: -124px -26px
		.login-icon_btn
			display: block
			width: 100%
			height: 40px
		.login-icon_input input
			background: transparent
			margin-bottom: 20px
			height: 40px
			line-height: 40px
		.el-button span
			font-size: 16px
			font-weight: 300
		label
			height: 30px
			color: #fff
		.el-checkbox .el-checkbox__label
			color: #606266
		.is-checked+.el-checkbox__label
			color: #409EFF
</style>