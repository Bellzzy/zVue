<!-- 用户详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-input type='password' v-model='data.passWord' slot='passWord'></el-input>
		</cc-form>
		<div class='opt'>
			<el-button v-if='"view" != params.todo' type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit'>提交</el-button>
			<el-button type='danger' @click="$emit('close')">关闭</el-button>
		</div>
	</div>
</template>
<script>
export default {
	props: ['params'],
	data() {
		return {
			data: {
				id: '',
				userName: '',
				chineseName: '',
				chineseName: '',
				mobilePhone: '',
				email: '',
				company: '',
				roleId: '',
				statu: '0',
				passWord: '',
				cusId: ''
			},
			baseCols: [
				[
					{
						label: '用户名',
						prop: 'userName',
						input: true
					}, {
						label: '用户姓名',
						prop: 'chineseName',
						input: true
					}, {
						label: '联系方式',
						input: true,
						prop: 'mobilePhone'
					}, {
						label: '邮箱',
						input: true,
						prop: 'email'
					}, {
						label: '所属客户',
						base: 'CUSTOMER',
						prop: 'cusId'
					}
				], [
					{
						label: '所属公司',
						base: 'COMPANY',
						prop: 'company'
					}, {
						label: '密码',
						slot: 'passWord',
					}, {
						label: '角色',
						base: 'ROLE',
						prop: 'roleId'
					}, {
						label: '状态',
						radio: true,
						prop: 'statu',
						list: [
							{
								name: '正常',
								value: '0'
							}, {
								name: '禁用',
								value: '1'
							}
						]
					}
				]
			],
			baseRules: {
				userName: this.__Valid.init(['null']),
			},
			formSet: {
				span: 12
			},
			onSubmit: false
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				this.onSubmit = true;
				let data = JSON.parse(JSON.stringify(this.data));
				if('add' != this.params.todo) {
					delete data.passWord;
				}
				if(!data.company) {
					data.company = -1;
				}
				this.axios.post('/user/usercontroller/saveOrUpdate', data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg)
						this.$emit('close');
						this.params.callback && this.params.callback();
					}
				}).catch(err => {
					this.onSubmit = false;
				})
			})
		}
	},
	mounted() {
		if('view' == this.params.todo) {
			this.__alertView(this.baseCols);
			this.baseRules = {};
		}
		if('add' != this.params.todo) {
			this.__setValue(this.data, this.params.row);
			this.baseCols[1].splice(1, 1)
		}
	}
}
</script>
<style lang="stylus">
</style>

