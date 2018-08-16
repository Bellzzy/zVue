<!-- 设置详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item label='内容' slot='row'>
				<UE :defaultMsg='data.helpContent' :config='config' ref="ue"></UE>
			</el-form-item>
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
				helpTitle: '',
				helpStatus: '',
				helpContent: ''
			},
			config: {
				initialFrameWidth: null,
				initialFrameHeight: 350,
				readonly: false
			},
			baseCols: [
				[
					{
						label: '标题',
						prop: 'helpTitle',
						input: true
					}
				]
			],
			baseRules: {
				helpTitle: this.__Valid.init(['null']),
			},
			formSet: {
				span: 24,
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
				let data = JSON.parse(JSON.stringify(this.data)),
					url = '/help/addHelp'
				if('edit' == this.params.todo) {
					url = '/help/editHelp'
				}
				data.helpContent = this.$refs.ue.getUEContent();
				if('add' == this.params.todo) {
					delete data.id;
				}
				this.onSubmit = true;
				this.axios.post(url, data).then(res => {
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
	created() {
		if('view' == this.params.todo) {
			this.config.readonly = true;
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
