<!-- 类型详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'></cc-form>
		<div class='opt'>
			<el-button v-if='"view" != params.todo' type='success' @click='submit' :disabled='onSubmit' :loading='onSubmit'>提交</el-button>
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
				id: '',
				mid: ''
			},
			baseCols: [
				[
					{
						label: '类型名称：',
						prop: 'dicValue',
						input: true
					}, {
						label: '类型：',
						input: true,
						prop: 'dicCode'
					}
				]
			],
			baseRules: {
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
				let dataUrl = '/dictionary/addDictionaryDetail'
				if(this.data.id) {
					dataUrl = '/dictionary/editDictionaryDetail'
				}
				this.axios.post(dataUrl, this.data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg)
						this.$emit('updateCache', {
							type: 'dic'
						});
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
		}
		if('add' == this.params.todo) {
			this.data.mid = this.params.row.id;
		}
	}
}
</script>
