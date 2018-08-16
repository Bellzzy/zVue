<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
		</cc-form>
		<div class="opt">
			<el-button type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit'>提交</el-button>
			<el-button type='success' @click="$emit('close')">关闭</el-button>
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
					number: '',
					leaseName: '',
					band: ''
				},
				baseCols: [
					[
						{
							label: '租赁公司名称',
							prop: 'leaseName',
							input: true,
						}, {
							label: '车辆品牌',
							prop: 'band',
							input: true
						}
					]
				],
				baseRules: {
					leaseName: this.__Valid.init(['null'])
				},
				formSet: {
					labelWidth: '120px'
				},
				onSubmit: false
			}
		},
		methods: {
			submit() {
				new Promise((resolve) => {
					this.$refs.form.validate(resolve)
				}).then(s => {
					let url = '/data/addLeaseInfo'
					if('edit' == this.params.todo) {
						url = '/data/editLeaseInfo'
					}
					this.onSubmit = true;
					this.axios.post(url, this.data).then(res => {
						this.onSubmit = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.')
							this.$emit('close');
							this.$emit('updateCache', {
								type: 'leasing'
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