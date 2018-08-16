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
					areaName: '',
					cityId: ''
				},
				baseCols: [
					[
						{
							label: '行政区名称',
							prop: 'areaName',
							input: true
						}, {
							label: '城市名称',
							prop: 'cityId',
							base: 'CITY'
						}
					]
				],
				baseRules: {
					// 行政区名称
					areaName: this.__Valid.init(['null'])
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
					let url = '/data/addAreaInfo'
					if('edit' == this.params.todo) {
						url = '/data/editAreaInfo'
					}
					this.onSubmit = true;
					this.axios.post(url, this.data).then(res => {
						this.onSubmit = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.')
							this.$emit('close');
							this.$emit('updateCache', {
								type: 'regions'
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