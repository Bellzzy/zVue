<!-- 日营运填报 -->
<template>
	<div class="alert-body__component">
		<div>
			<strong>任务信息</strong><hr />
			<cc-form :data='data' :cols='taskCols' :rules='baseRules' :settings='formSet' ref='form1'>
				<span v-if='"view" == params.todo' slot='taskNo'>{{data.taskNo}}</span>
				<el-input slot='taskNo' v-model='data.taskNo' @blur='taskNoBlur' v-else></el-input>
			</cc-form>
			<strong>货物信息</strong><hr />
			<cc-form :data='data' :cols='goodsCols' :rules='baseRules' :settings='formSet' ref='form2'>
			</cc-form>
			<strong>费用信息</strong><hr />
			<cc-form :data='data' :cols='costCols' :rules='baseRules' :settings='formSet' ref='form3'>
			</cc-form>
			<strong>线路/里程信息</strong><hr />
			<cc-form :data='data' :cols='lineMileageCols' :rules='baseRules' :settings='formSet' ref='form4'>
				<span v-if='"view" == params.todo' slot='orderMileage'>{{data.orderMileage}}</span>
				<el-input slot='orderMileage' v-model='data.orderMileage' @blur='orderMileageBlur' v-else></el-input>
				<span v-if='"view" == params.todo' slot='jotMileage'>{{data.jotMileage}}</span>
				<el-input slot='jotMileage' v-model='data.jotMileage' @blur='jotMileageBlur' v-else></el-input>
			</cc-form>
			<cc-form :data='data' :cols='lineCols' :rules='baseRules' :settings='formSet' ref='form5' style="width: 90%">
			</cc-form>
			<div class="opt">
				<el-button v-if='"view" != params.todo' type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit'>提交</el-button>
				<el-button type='primary' @click="$emit('close')">关闭</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['params'],
		data() {
			let self = this
			return {
				data: {
					id: '',
					taskNo: '',
					taskDate: '',
					arriveDate: '',
					curId: '',
					plate: '',
					modelId: '',
					contactsName: '',
					projectId: '',
					salesmanId: '',
					cargoType: '',
					cargoNumber: '',
					cargoPoint: '',
					quantity: '',
					speelCost: '',
					isSpeel: '',
					subsidyCost: '',
					hamalName:'',
					degree: '',
					parkingCost: '',
					isPaking: '',
					isMode: '',
					pleaseCost: '',
					hamalCost: '',
					cost: '',
					otherCost: '',
					money: '',
					setDate: '',
					mileage: '',
					jotDate: '',
					orderMileage: '',
					jotMileage: '',
					route: '',
					remark: ''
				},
				taskCols: [
					[
						{
							label: '任务编号',
							// prop: 'taskNo',
							slot: 'taskNo',

						},{
							label: '任务日期',
							date: true,
							prop: 'taskDate'
						}, {
							label: '到仓时间',
							input: true,
							prop: 'arriveDate'
						}
					],[
						{
							label: '客户名称',
							base: 'CUSTOMER',
							prop: 'curId'
						},{
							label: '车牌号',
							input: true,
							prop: 'plate'
						},{
							label: '车型',
							dic: 'MODEL',
							prop: 'modelId'
						}
					],[
						 {
							label: '货运师姓名',
							input: true,
							prop: 'contactsName'
						}, {
							label: '业务负责人',
							prop: 'salesmanId',
							base: 'SALESMAN'
						}, {
							label: '项目负责人',
							base: 'PM',
							prop: 'projectId'
						}
					]
				],
				goodsCols: [
					[
						{
							label: '货物类型',
							base: 'GOODSTYPE',
							prop: 'cargoType'
						}
					],[
						{
							label: '件数',
							input: true,
							prop: 'cargoNumber'
						}
					],[
						{
							label: '点数',
							input: true,
							prop: 'cargoPoint'
						}
					]
				],
				costCols:  [
					[
						{
							label: '剩余电量',
							input: true,
							prop: 'quantity'
						}, {
							label: '高速费',
							input: true,
							prop: 'speelCost'
						}, {
							label: '高速费报销',
							select: true,
							prop: 'isSpeel',
							option: [{
								label:'已报销',
								value: 1
							},{
								label: '未报销',
								value: 0
							}]
						}, {
							label: '夜间补贴',
							input: true,
							prop: 'subsidyCost'
						}, {
							label: '搬运工名称',
							input: true,
							prop: 'hamalName'
						}
					],[
						{
							label: '充电度数',
							input: true,
							prop: 'degree'
						}, {
							label: '停车费',
							input: true,
							prop: 'parkingCost'
						}, {
							label: '停车费报销',
							select: true,
							prop: 'isPaking',
							option: [{
								label:'已报销',
								value: 1
							},{
								label: '未报销',
								value: 0
							}]
						}, {
							label: '外请费用',
							input: true,
							prop: 'pleaseCost'
						}, {
							label: '搬运工费用',
							input: true,
							prop: 'hamalCost'
						}
					],[
						{
							label: '充电费用',
							input: true,
							prop: 'cost'
						}, {
							label: '其他费用',
							input: true,
							prop: 'otherCost'
						}, {
							label: '结算方式',
							dic: 'PAYTYPE',
							prop:'isMode'
						}, {
							label:'应收金额',
							input: true,
							prop: 'money'
						}
					]
				],
				lineMileageCols: [
					[
						{
							label: '出发时间',
							input: true,
							prop: 'setDate'
						},{
							label: '返程时间',
							input: true,
							prop: 'jotDate'
						}
					],[
						{
							label: '订单里程',
							slot: 'orderMileage'
						},{
							label: '返程里程',
							slot: 'jotMileage'
						}
					],[
						{
							label: '总里程',
							// input: true,
							prop: 'mileage'
						}
						
					]
				],
				lineCols: [
					[
						{
							label: '配送线路',
							textarea: true,
							prop: 'route',
							rows: '1'
						}, {
							label: '备注',
							textarea: true,
							prop: 'remark'
						}
					]
				],
				baseRules: {
					taskNo: this.__Valid.init(['null']),
					cargoNumber: this.__Valid.init(['null', 'int']),
					cargoPoint: this.__Valid.init(['null', 'int']),					
					speelCost: this.__Valid.init(['int']),
					subsidyCost: this.__Valid.init(['int']),
					degree: this.__Valid.init(['int']),
					parkingCost: this.__Valid.init(['int']),					
					speelCost: this.__Valid.init(['int']),
					pleaseCost: this.__Valid.init(['int']),
					hamalCost: this.__Valid.init(['int']),
					cost: this.__Valid.init(['int']),
					quantity: this.__Valid.init(['percentage']),
					otherCost: this.__Valid.init(['int']),
					money: this.__Valid.init(['int']),
					setDate: this.__Valid.init(['hoursNocolon']),
					mileage: this.__Valid.init(['null','int']),
					jotDate: this.__Valid.init(['hoursNocolon']),
					orderMileage: this.__Valid.init(['null','int']),
					jotMileage: this.__Valid.init(['null', 'int']),
					route: this.__Valid.init(['null']),
					plate: this.__Valid.init(['carNumber']),
				},
				formSet: {
					labelWidth: '120px'
				},
				onSubmit: false,
				disabled: false
			}
		},
		methods: {
			submit(){
				new Promise((resolve) => {
					this.$refs.form1.validate(() => {
						this.$refs.form2.validate(() => {
							this.$refs.form3.validate(() => {
								this.$refs.form4.validate(() => {
									this.$refs.form5.validate(resolve)
								})
							})
						})
					})
				}).then(s => {
					let url;
					if('add' == this.params.todo) {
						url = '/dispatch/addOperateDate'
					}
					if('edit' == this.params.todo) {
						url = '/dispatch/editOperateDate'
					}
					this.onSubmit = true;
					this.axios.post(url, this.data).then(res => {
						this.onSubmit = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.')
							this.$emit('close');
							this.params.callback && this.params.callback();
						}
					}).catch(err => {
						this.onSubmit = false;
					})
				})
			},
			taskNoBlur() {
				// TODO
				this.axios.get('/dispatch/getTaskByNo',{params: {no: this.data.taskNo}}).then(res => {
					this.data.taskDate = res.data[0].taskDate
					this.data.arriveDate = res.data[0].arriveDate
					this.data.curId = res.data[0].curId
					this.data.plate = res.data[0].plate
					this.data.modelId = res.data[0].modelId
					this.data.contactsName = res.data[0].contactsName
					this.data.salesmanId = res.data[0].salesmanId
					this.data.projectId = res.data[0].projectId
					this.data.cargoType = res.data[0].cargoType
				})
			},
			orderMileageBlur() {
				if(this.data.jotMileage == '') {
					this.data.mileage = Number.parseInt(this.data.orderMileage) + 0
				} else {
					this.data.mileage = Number.parseInt(this.data.orderMileage) + Number.parseInt(this.data.jotMileage)
				}
				if((this.data.mileage + '') == 'NaN') {
					this.data.mileage = 0
				}
			},
			jotMileageBlur() {
				if(this.data.orderMileage == '') {
					this.data.mileage =  Number.parseInt(this.data.jotMileage ) + 0
				} else {
					this.data.mileage = Number.parseInt(this.data.orderMileage) + Number.parseInt(this.data.jotMileage)
				}
				if((this.data.mileage + '') == 'NaN') {
					this.data.mileage = 0
				}
			}
		},
		mounted() {
			if('add' != this.params.todo) {
				this.__setValue(this.data, this.params.row);
			}
			if('view' == this.params.todo) {
				this.__alertView(this.taskCols);
				this.__alertView(this.goodsCols);
				this.__alertView(this.costCols);
				this.__alertView(this.lineMileageCols);
				this.__alertView(this.lineCols);
				this.baseRules = {}
			}
		}
	}
</script>
