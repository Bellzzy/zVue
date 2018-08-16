<!-- 外请搬运工 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item slot='row' label='备注'>
				<span v-if='"view" == params.todo'>{{data.remark}}</span>
				<el-input type='textarea' :rows='5' v-model='data.remark' style='width: 90%' v-else></el-input>
			</el-form-item>
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
					id: '',
					name: '',
					sex: '',
					phone: '',
					shenfzNo: '',
					age: '',
					address: '',
					orgId: '',
					remark: ''
				},
				baseCols: [
					[
						{
							label: '姓名',
							prop: 'name',
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
							input: true,
							prop: 'phone'
						},{
							label: '身份证号',
							input: true,
							prop: 'shenfzNo'
						}
					],[
						{
							label: '年龄',
							input: true,
							prop: 'age'
						},{
							label: '现居地址',
							input: true,
							prop: 'address'
						},{
							label: '归属公司',
							base: 'COMPANY',
							prop: 'orgId'
						}
					]
				],
				baseRules: {
					name: this.__Valid.init(['null']),
					sex: this.__Valid.init(['null']),
					phone: this.__Valid.init(['phone']),
					shenfzNo: this.__Valid.init(['card']),
					age: this.__Valid.init(['int']),
					orgId: this.__Valid.init(['null'])
				},
				formSet: {
					span: 12,
					labelWidth: '120px'
				},
				onSubmit: false
			}
		},
		methods: {
			submit(){
				new Promise((resolve) => {
					this.$refs.form.validate(resolve)
				}).then(s => {
					let data = JSON.parse(JSON.stringify(this.data))
					let dataUrl = '/capacityManager/addPleaseCarrierInfo'
					if(this.data.id) {
						dataUrl = '/capacityManager/editPleaseCarrierInfo';
						data.id = this.data.id
					}
					this.axios.post(dataUrl, data).then(res => {
						this.onSubmit = false;
						if(200 == res.code) {
							this.$message.success(res.msg)
							this.$emit('close');
							this.params.callback && this.params.callback();
							this.$emit('updateBase', 'OUTSIDE');
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