<!-- 公告详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item label='公告内容' slot='row'>
				<UE :defaultMsg='data.bulletinContent' :config='config' ref="ue"></UE>
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
				endShowTime: '',
				startShowTime: '',
				bulletinTitle: '',
				bulletinContent: '',
				
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
						prop: 'bulletinTitle',
						input: true
					}, {
						label: '展示开始时间',
						date: true,
						prop: 'startShowTime'
					}, {
						label: '展示结束时间',
						date: true,
						prop: 'endShowTime'
					}
				]
			],
			baseRules: {
				bulletinTitle: this.__Valid.init(['null']),
				startShowTime: this.__Valid.init(['null']),
				endShowTime: this.__Valid.init(['null']),
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
			}).then(s => {				let data = JSON.parse(JSON.stringify(this.data)),
					url = '/tmsAppBulletin/addAppBulletin'
				if('edit' == this.params.todo) {
					url = '/tmsAppBulletin/editAppBulletin'
				}
				data.bulletinContent = this.$refs.ue.getUEContent();
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
