<!-- 内部车辆运力 -->
<template>
	<div class="alert-body__component">
		<div>
			<strong>基本信息</strong><hr />
			<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form1'>
			</cc-form>
			<strong>运营信息</strong><hr />
			<cc-form :data='data' :cols='OperateCols' :rules='baseRules' :settings='formSet' ref='form2'>
			</cc-form>
			<div class="opt">
				<el-button type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit' v-if='"view" != params.todo'>提交</el-button>
				<el-button type='danger' @click="$emit('close')">关闭</el-button>
			</div>
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
					brand: '',
					model: '',
					orgId: '',
					mileage: '',
					registerDate: '',
					trialDate: '',
					code: '',
					number: '',
					brandModel: '',
					capacity: '',
					dkBrand: '',
					djBrand: '',
					guaranteeDate: '',
					leaseStartDate:'',
					leaseEndDate: '',
					overStartDate: '',
					overEndDate: '',
					businessStartDate: '',
					businessEndDate: '',
					operateCur: '',
					vehicleState: '',
					remark: ''
				},
				baseCols: [
					[
						{
							label: '车牌号',
							prop: 'plate',
							input: true
						}, {
							label: '品牌型号',
							input: true,
							prop: 'brand',
						}, {
				          	label: '车型',
				           	prop: 'model',
				            dic: 'MODEL'
						}, {
							label: '所属公司',
							base: 'COMPANY',
							prop: 'orgId'
						}, {
							label: '最高行驶里程',
							input: true,
							prop: 'mileage'
						}
					],[
						{
							label: '行驶证登记日期',
							date: true,
							prop: 'registerDate'
						},{
							label: '下次年审日期',
							date: true,
							prop: 'trialDate'
						},
						{
							label: '识别代码',
							input: true,
							prop: 'code'
						}, {
							label: '发动机号',
							input: true,
							prop: 'number'
						},{
							label: '电池品牌型号',
							input: true,
							prop: 'brandModel'
						}
					],[
						 {
							label: '电池容量',
							input: true,
							prop: 'capacity'
						}, {
							label: '电控品牌型号',
							input: true,
							prop: 'dkBrand'
						}, {
							label: '电机品牌型号',
							input: true,
							prop: 'djBrand'
						}, {
							label: '最近保修日期',
							date: true,
							prop: 'guaranteeDate'
						}
					]
				],
				OperateCols: [
					[
						{
							label: '租赁起始日期',
							date: true,
							prop: 'leaseStartDate'
						},{
							label: '租赁截止日期',
							date: true,
							prop: 'leaseEndDate'
						},{
							label: '租赁公司',
            				base: 'LEASING',
							prop: 'operateCur'
						}
					],[
						{
							label: '商业险购买日期',
							date: true,
							prop: 'businessStartDate'
						},
						{
							label: '商业险到期日期',
							date: true,
							prop: 'businessEndDate'
						},{

							label: '车辆状态',
							dic: 'CARSTATUS',
							prop: 'vehicleState'
						}
					],[
						{
							label: '交强险购买日期',
							date: true,
							prop: 'overStartDate'
						},
						{
							label: '交强险到期日期',
							date: true,
							prop: 'overEndDate'
						}
					]
				],
				baseRules: {
					plate: this.__Valid.init(['carNumber', 'null']),
					brand: this.__Valid.init(['null']),
					model: this.__Valid.init(['null']),
					orgId: this.__Valid.init(['null']),
					mileage: this.__Valid.init(['int']),
					registerDate: this.__Valid.init(['null']),
					trialDate: this.__Valid.init(['null']),
					code: this.__Valid.init(['null']),
					number: this.__Valid.init(['null'])
				},
				formSet: {
					labelWidth: '120px'
				},
				onSubmit: false
			}
		},
		methods: {
			submit(){
				new Promise((resolve) => {
					this.$refs.form1.validate(() => {
						this.$refs.form2.validate(resolve)
					})
				}).then(s => {
					let url = '/capacityManager/addVehicleInfo';
					let data = JSON.parse(JSON.stringify(this.data))
					if('edit' == this.params.todo) {
						url = '/capacityManager/editVehicleInfo'
					}
					this.onSubmit = true;
					this.axios.post(url, data).then(res => {
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
			if('add' == this.params.todo) { 
				this.data.vehicleState = '19'
			}
			if('add' != this.params.todo) {
				this.__setValue(this.data, this.params.row);
			}
			if('view' == this.params.todo) {
				this.__alertView(this.baseCols);
				this.__alertView(this.OperateCols);
				this.baseRules = {}
			}
		}
	}
</script>
