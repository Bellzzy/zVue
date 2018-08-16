<!-- 日常任务排班 -->
<template>
	<div class='alert-body__component'>
		<el-row>
			<el-col :span='12'>
				<h1>任务信息</h1>
				<cc-form :data='task' :cols='taskCols' :settings='taskFormSet' ref='task'></cc-form>
			</el-col>
			<el-col :span='12'>
				<h1>排班表</h1>
				<cc-form :data='sche' :cols='scheCols' :settings='scheFormSet' :rules='scheRules' ref='sche'>
					<span slot='plate' v-if='"view" == params.todo'>{{sche.plate}}</span>
					<el-autocomplete v-else class="inline-input" v-model="sche.plate" placeholder="请输入内容" slot='plate' 
					 	:fetch-suggestions="plateSearch" @select="plateSelect" value-key='plate'></el-autocomplete>
					<span slot='driver' v-if='"view" == params.todo'>{{sche.driver}}</span>
					<el-autocomplete class="inline-input" v-model="sche.driver" placeholder="请输入内容" slot='driver' 
					 	:fetch-suggestions="driverSearch" @select="driverSelect" value-key='name'></el-autocomplete>
				</cc-form>
			</el-col>
		</el-row>
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
			task: {
				id: '',
				taskNo: '',
				cusId: '',
				taskTime: '',
				modelId: '',
				partId: '',
				address: '',
				arriveDate: '',
				ygMileage: '',
				contactsName: '',
				phone: '',
				taskState: '',
				cargoType: '',
				remark: '',
				scheEntity: {
				},
			},
			taskCols: [
				[
					{
						label: '客户名称',
						prop: 'cusId',
						base: 'CUSTOMER',
						disabled: true
					}, {
						label: '需求日期',
						prop: 'taskTime'
					}, {
						label: '点部名称',
						prop: 'partId',
						base: 'POINT',
						disabled: true
					}, {
						label: '取货地点',
						prop: 'address'
					}, {
						label: '到仓时间',
						prop: 'arriveDate'
					}, {
						label: '所需车型',
						prop: 'modelId',
						dic: 'MODEL',
						disabled: true
					}, {
						label: '预估里程',
						prop: 'ygMileage'
					}, {
						label: '货物类型',
						prop: 'cargoType',
						base: 'GOODSTYPE',
						disabled: true
					}, {
						label: '联系人',
						prop: 'contactsName'
					}, {
						label: '联系方式',
						prop: 'phone'
					}, {
						label: '备注',
						prop: 'remark'
					}
				]
			],
			taskFormSet: {
				span: 24,
				labelWidth: '100px'
			},
			sche: {
				type: '',
				plate: '',
				driver: '',
				driverId: '',
				driverPhone: '',
			},
			scheCols: [
				[
					{
						label: '运力来源',
						radio: true,
						prop: 'type',
						list: [
							{
								value: '0',
								name: '外部运力'
							}, {
								value: '1',
								name: '内部运力'
							}
						],
						change(val) {
							self.sche.plate = '';
							self.sche.driver = '';
							self.sche.driverPhone = '';
							if(0 == val) {
								self.plateList = self.__getBaseData('OUTSIDECAR')
								self.scheCols[0][2].prop = 'driver';
								self.scheCols[0][2].input = true;
								delete self.scheCols[0][2].slot;
							} else {
								self.plateList = self.__getBaseData('INSIDECAR')
								self.scheCols[0][2].slot = 'driver';
								self.scheCols[0][2].input = false;
								delete self.scheCols[0][2].prop;
							}
						}
					}, {
						label: '车牌号',
						slot: 'plate'
					}, {
						label: '驾驶员',
						input: true,
						prop: 'driver'
					}, {
						label: '联系电话',
						input: true,
						prop: 'driverPhone'
					}
				]
			],
			scheFormSet: {
				span: 24
			},
			scheRules: {
				type: this.__Valid.init(['null']),
				plate: this.__Valid.init(['carNumber', 'null']),
				driver: this.__Valid.init(['null']),
				driverPhone: this.__Valid.init(['phone', 'null'])
			},
			onSubmit: false,
			plateList: [],
			driverList: self.__getBaseData('INSIDEDRIVER')
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.sche.validate(resolve)
			}).then(s => {
				this.onSubmit = true;
				let data = {
					id: this.task.id,
					scheEntity: this.sche
				}
				this.axios.post('/tms/dispatch/submitDispatch', data).then(res => {
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
		},
		// 获取排班信息
		getDispatchInfo() {
			this.axios.post('/tms/dispatch/getDispatchInfo', {id: this.params.row.id}).then(res => {
				if(200 == res.code) {
					let data = res.data || {};
					this.sche = {
						type: data.type,
						plate: data.plate,
						driver: data.driver,
						driverPhone: data.driverPhone,
					}
					this.task = data;
				}
			})
		},
		plateSearch(qs, cb) {
			cb(this.plateList)
		},
		plateSelect(item) {
			console.log(item)
			if(0 == this.sche.type) {
				this.sche.driverId = item.id;
				this.sche.driver = item.driverName;
				this.sche.driverPhone = item.phone;
			}
		},
		driverSearch(qs, cb) {
			cb(this.driverList)
		},
		driverSelect(item) {
			this.sche.driverId = item.id;
			this.sche.driverPhone = item.phone;
		}
	},
	mounted() {
		// console.log(this.params.row)
		if('view' == this.params.todo) {
			this.__alertView(this.scheCols);
			this.scheRules = {};
		}
		if('add' != this.params.todo) {
			// this.__setValue(this.task, this.params.row);
			this.getDispatchInfo();
		}
	},
}
</script>
