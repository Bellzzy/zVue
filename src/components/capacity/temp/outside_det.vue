<!-- 外请运力信息 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item slot='row' label='备注'>
				<span v-if='"view" == params.todo'>{{data.remark}}</span>
				<el-input type='textarea' :rows='5' v-model='data.remark' style='width:90%' v-else></el-input>
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
					plate: '',
					pleaseType: '',
					model: '',
					energyType: '',
					driverName: '',
					phone: '',
					shenfzNo: '',
					driverNo: '',
					adderss: '',
					orgId: '',
					isIns: '',
					remark: ''
				},
				baseCols: [
					[
						{
							label: '车牌号',
							prop: 'plate',
							input: true
						},{
				          	label: '车型',
				           	prop: 'model',
				            dic: 'MODEL'
				         },{
							label: '能源类型',
							prop: 'energyType',
							dic: 'ENERGYTYPE'
						},{
							label: '所属主体',
							prop: 'pleaseType',
							dic: 'PLEASETYPE'
						},{
							label: '驾驶员姓名',
							input: true,
							prop: 'driverName'
						},{
							label: '联系电话',
							input: true,
							prop: 'phone'
						}
					],[
						{
							label: '身份证号',
							input: true,
							prop: 'shenfzNo'
						},{
							label: '驾驶证号',
							input: true,
							prop: 'driverNo'
						},{
							label: '现居地址',
							input: true,
							prop: 'adderss'
						},{
							label: '归属分公司',
							base: 'COMPANY',
							prop: 'orgId'
						},{
							label: '公司是否为他购买保险',
							prop: 'isIns',
							select: true,
							option: [{
								label: '是',
								value: '1'
							},{
								label: '否',
								value: '0'
							}]
						}
					]
				],
				baseRules: {
					plate: this.__Valid.init(['carNumber']),
					model: this.__Valid.init(['null']),
					energyType: this.__Valid.init(['null']),
					pleaseType: this.__Valid.init(['null']),
					orgId: this.__Valid.init(['null']),
					
					driverName: this.__Valid.init(['null']),
					phone: this.__Valid.init(['tel']),
					shenfzNo: this.__Valid.init(['card']),
					isIns: this.__Valid.init(['null'])
				},
				formSet: {
					span: 12,
					labelWidth: '142px'
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
					let dataUrl = '/capacityManager/addPleasePowerInfo'
					if (this.data.id) {
						dataUrl = '/capacityManager/editPleasePowerInfo'
						data.id = this.data.id;
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
