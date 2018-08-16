<!-- 字典查看、新增、编辑 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'></cc-form>
		<div class='opt'>
			<el-button type='success' v-if='"view" != params.todo' @click='submit' :disabled='onSubmit' :loading='onSubmit'>提交</el-button>
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
				dicCode: '',
				dicValue: '',
				id: ''
			},
			baseCols: [
				[
					{
						label: '字典名称：',
						prop: 'dicValue',
						input: true
					}, {
						label: '字典类型：',
						prop: 'dicCode',
						input: true
					}
				]
			],
			baseRules: {
				dicCode: this.__Valid.init(['null']),
				dicValue: this.__Valid.init(['null']),
			},
			formSet: {
				span: 12,
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
				this.onSubmit = true;
				let dataUrl = '/dictionary/addDictionary'
				if(this.data.id) {
					dataUrl = '/dictionary/editDictionary'
				}
				this.axios.post(dataUrl, this.data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg)
						this.$emit('close')
						this.$emit('updateCache', {
							type: 'dic'
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
		}
	}
}
</script>
