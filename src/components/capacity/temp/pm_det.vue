<!-- 项目负责人 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
		</cc-form>
		<div class="opt">
			<el-button type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit' v-if='"view" != params.todo'>提交</el-button>
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
					leName: '',
					phone: '',
					orgId: '',
					id: '',
					sex: '',
					identityNo: '',
					culture: '',
					state: ''
				},
				baseCols: [
					[
						{
							label: '负责人姓名',
							prop: 'leName',
							input: true
						},{
							label: '性别',
							prop: 'sex',
							select: true,
							option: [{
								label: '男',
								value: 1
							},{
								label: '女',
								value: 0
							}]
						},{
							label: '联系电话',
							prop: 'phone',
							input: true
						},{
							label: '身份证号码',
							prop: 'identityNo',
							input: true
						}
					],[
						{
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
						},{
							label: '所属公司',
							prop: 'orgId',
							base: 'COMPANY'
						},{
							label: '状态',
							prop: 'state',
							dic: 'STATUS'
						}
					]
				],
				baseRules: {
					leName: this.__Valid.init(['null']),
					sex: this.__Valid.init(['null']),
					phone: this.__Valid.init(['phone', 'null']),
					identityNo: this.__Valid.init(['card']),
					orgId: this.__Valid.init(['null']),
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
					let url;
					if('add' == this.params.todo) {
						url = '/tmsProjectInfo/add'
					}
					if('edit' == this.params.todo) {
						url = '/tmsProjectInfo/update'
					}
					this.onSave = true;
					this.axios.post(url, this.data).then(res => {
						this.onSave = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.');
							this.$emit('close');
							this.$emit('updateCache', {
								type: 'pm'
							});
							this.params.callback && this.params.callback();
						}
					}).catch(err => {
						this.onSave = false;
					})
				})
			}
		},
		mounted() {
			if('add' != this.params.todo) {
				this.__setValue(this.data, this.params.row);
			}
			if('view' == this.params.todo) {
				this.__alertView(this.baseCols);
				this.baseRules = {}
			}
		}
	}
</script>