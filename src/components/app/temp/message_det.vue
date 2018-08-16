<!-- 公告详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item label='公告内容' slot='row' prop='pushContent'>
				<el-input type='textarea' v-model='data.pushContent' :rows='5' v-if='"add" == params.todo'/>
				<span v-else>{{data.pushContent}}</span>
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
		let self = this;
		return {
			data: {
				id: '',
				pushType: '',
				pushWay: '',
				pushAccount: '',
				pushContent: '',
				pushStatus: '',
				pushTime: '',
			},
			baseCols: [
				[
					{
						label: '推送类型',
						prop: 'pushType',
						select: true,
						option: [
							{
								label: '全体货运师',
								value: 1
							}, {
								label: '内部货运师',
								value: 2
							}, {
								label: '外部货运师',
								value: 3
							}, {
								label: '单个货运师',
								value: 4
							}
						]
					}, {
						label: '推送方式',
						radio: true,
						prop: 'pushWay',
						list: [
							{
								value: '2',
								name: 'APP通知'
							}, {
								value: '1',
								name: '短信'
							}
						]
					}
				]
			],
			baseRules: {
				pushType: this.__Valid.init(['null']),
				pushWay: this.__Valid.init(['null']),
				pushContent: this.__Valid.init(['null']),
				pushAccount: this.__Valid.init(['null']),
			},
			formSet: {
				span: 24
			},
			onSubmit: false
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				let data = JSON.parse(JSON.stringify(this.data));
				if(4 == data.pushType && !data.pushAccount) {
					this.$message.error('推送类型为单个货运师时，接收账号不能为空.')
					return
				}
				this.onSubmit = true;
				this.axios.post('/tmsMessagePush/addTmsMessagePush', data).then(res => {
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
			this.baseCols[0].push({
				label: '推送状态',
				prop: 'pushStatus',
				format(val) {
					return '0' == val ? '失败' : '成功';
				}
			})
			this.baseCols[0].push({
				label: '推送时间',
				prop: 'pushTime',
				filter: 'dateFormat',
				filterParams: 'yyyy-MM-dd hh:mm:ss'
			})
			if(4 == this.data.pushType) {
				this.baseCols[0].splice(1, 0, {
					label: '接收账号',
					// input: true,
					prop: 'pushAccount'
				})
			}
		}
		if('add' != this.params.todo) {
			this.__setValue(this.data, this.params.row);
		}
	},
	watch: {
		pushType(n) {
			if(4 == n) {
				this.baseCols[0].splice(1, 0, {
					label: '接收账号',
					input: 'view' != this.params.todo,
					prop: 'pushAccount'
				})
			} else {
				let cols = this.baseCols[0];
				let i = cols.length;
				while(i--) {
					if('pushAccount' == cols[i].prop) {
						cols.splice(i, 1)
						break;
					}
				}
			}
		}
	},
	computed: {
		pushType() {
			return this.data.pushType;
		}
	}

}
</script>
