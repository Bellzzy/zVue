<!-- 客户详情 -->
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
				cusname: '',
				cusshort: '',
				contactp: '',
				phone: '',
				cusadderss: '',
				cusbusiness: '',
				busphone: '',
				state: '',
				iskaip: '',
				htdate: '',
				ismode: '',
				businessperson: '',
				orgid: '',
				id: ''
			},
			baseCols: [
				[
					{
						label: '客户全称',
						prop: 'cusname',
						input: true
					}, {
						label: '客户简称',
						input: true,
						prop: 'cusshort'
					}, {
						label: '客户联系人',
						input: true,
						prop: 'contactp'
					}, {
						label: '联系电话',
						input: true,
						prop: 'phone'
					}, {
						label: '客户地址',
						input: true,
						prop: 'cusadderss'
					}
				],[
					{
						label: '结算方式',
						dic: 'PAYTYPE',
						prop: 'ismode'
					},{
						label: '对接业务员',
						base: 'SALESMAN',
						prop: 'cusbusiness'
					}, {
						label: '项目负责人',
						base: 'PM',
						prop: 'businessperson'
					}, {
						label: '客户所属机构',
						prop: 'orgid',
						base: 'COMPANY'
					},{
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
				cusname: this.__Valid.init(['null']),
				cusshort: this.__Valid.init(['null']),
				contactp: this.__Valid.init(['null']),
				phone: this.__Valid.init(['phone', 'null']),
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
					url = '/customerController/save';
				}
				if('edit' == this.params.todo) {
					url = '/customerController/update'
				}
				this.onSubmit = true;
				this.axios.post(url, this.data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg || '操作成功.')
						this.$emit('close');
						this.$emit('updateCache', {
							type: 'customer'
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
