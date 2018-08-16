<!-- 业务员详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'></cc-form>
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
				name: '',
				sex: '1',
				identityno: '',
				culture: '',
				phone: '',
				orgid: '',
				state: '1',
			},
			baseCols: [
				[
					{
						label: '姓名',
						prop: 'name',
						input: true
					}, {
						label: '性别',
						radio: true,
						prop: 'sex',
						list: [
							{
								name: '男',
								value: '1'
							}, {
								name: '女',
								value: '0'
							}
						]
					}, {
						label: '身份证号',
						input: true,
						prop: 'identityno'
					}, {
						label: '文化程度',
						prop: 'culture',
						select: true,
						option: [{
							label: '研究生',
							value: '研究生'
						},{
							label: '本科',
							value: '本科'
						},{
							label: '大专',
							value: '大专'
						},{
							label: '高中',
							value: '高中'
						},{
							label: '中专',
							value: '中专'
						},{
							label: '初中',
							value: '初中'
						},{
							label: '小学',
							value: '小学'
						}]
					}, {
						label: '联系电话',
						input: true,
						prop: 'phone'
					}, {
						label: '所属公司',
						base: 'COMPANY',
						prop: 'orgid'
					}, {
						label: '状态',
						radio: true,
						prop: 'state',
						list: [
							{
								name: '启用',
								value: '1'
							}, {
								name: '禁用',
								value: '0'
							}
						]
					}
				]
			],
			baseRules: {
				name: this.__Valid.init(['null']),
				sex: this.__Valid.init(['null']),
				identityno: this.__Valid.init(['card', 'null']),
				// culture: this.__Valid.init(['null']),
				state: this.__Valid.init(['null']),
				phone: this.__Valid.init(['phone', 'null']),
				orgid: this.__Valid.init(['null']),
			},
			formSet: {
				labelWidth: '100px'
			},
			onSubmit: false
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				let url ;
				if('add' == this.params.todo) {
					url = '/SalesmanController/insertSalesman';
				}
				if('edit' == this.params.todo) {
					url = '/SalesmanController/updateSalesman'
				}
				this.onSubmit = true;
				this.axios.post(url, this.data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg || '操作成功.')
						this.$emit('close');
						this.$emit('updateCache', {
							type: 'salesman'
						});
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
			let $ft = this.$root.$options.filters;
			this.data.htdate = $ft.dateFormat(this.data.htdate);
		}
	}
}
</script>
