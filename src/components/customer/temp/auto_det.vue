<!-- 自动任务设置 -->
<template>
	<div class='alert-body__component'>
		<div class='date'>
			<div class='date-title'>
				<span class='title'>选择日期类型</span>
				<span class='item' :class='{"active": 0==data.timeType}' @click='setSelectDay(0)'>全部</span>
				<span class='item' :class='{"active": 1==data.timeType}' @click='setSelectDay(1)'>周一至周五</span>
				<span class='item' :class='{"active": 2==data.timeType}' @click='setSelectDay(2)'>周六日</span>
				<span class='item' :class='{"active": 3==data.timeType}' @click='setSelectDay(3)'>自定义</span>
			</div>
			<cc-date style='margin: auto' ref='date'>
				<span v-for='item,index in dayArr' :key='index' :slot='dates.year+"-"+dates.month+"-"+(index+1)' slot-scope='scope' class='slot'>
					<el-checkbox :label='item' v-model='dayList' v-if='item > new Date().getDate()' :disabled='"view" == params.todo'></el-checkbox>
				</span>
			</cc-date>
		</div>
		<div class="edit">
			<h1>填写任务信息</h1>
			<cc-form :data='data' :cols='cols' :rules='rules' :settings='formSet' ref='scheForm'>
				<el-form-item label='备注' slot='row'>
					<span v-if='"view" == params.todo'>{{data.remark}}</span>
					<el-input v-else v-model='data.remark' type='textarea' :rows='5'></el-input>
				</el-form-item>
			</cc-form>
		</div>
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
					cusId: '',
					timeType: '3',
					modelId: '',
					arriveDate: '',
					cargoType: '',
					partId: '',
					address: '',
					ygMileage: '',
					startRegion: '',
					endRegion: '',
					contactsName: '',
					phone: '',
					effMonth: '',
					effDays: '',
					remark: ''
				},
				cols: [
					[
						{
							label: '客户名称',
							base: 'CUSTOMER',
							prop: 'cusId'
							// 根据登录用户自动获取
						}, {
							label: '日期类型',
							prop: 'timeType',
							format(val) {
								let i = self.timeTypeList.length;
								while(i--) {
									if(val == self.timeTypeList[i].value) {
										return self.timeTypeList[i].name
									}
								}
								return val;
							}
						}, {
							label: '所需车型',
							dic: 'MODEL',
							prop: 'modelId'
						}, {
							label: '到仓时间',
							input: true,
							prop: 'arriveDate'
						}, {
							label: '货物类型',
							base: 'GOODSTYPE',
							prop: 'cargoType'
						}, {
							label: '取货点部',
							base: 'POINT',
							prop: 'partId',
							change(obj) {
								self.data.address = obj.address;
							} 
						}, {
							label: '取货地址',
							input: true,
							prop: 'address'
						}, {
							label: '预估里程',
							input: true,
							prop: 'ygMileage'
						}
					], [
						{
							label: '起始区域',
							base: 'REGIONS',
							prop: 'startRegion'
						}, {
							label: '结束区域',
							base: 'REGIONS',
							prop: 'endRegion'
						}, {
							label: '取货联系人',
							input: true,
							prop: 'contactsName'
						}, {
							label: '取货联系方式',
							input: true,
							prop: 'phone'
						}
					]
				],
				formSet: {
					labelWidth: '100px'
				},
				rules: {
					timeType: this.__Valid.init(['null']),
					modelId: this.__Valid.init(['null']),
					arriveDate: this.__Valid.init(['hours', 'null']),
					cargoType: this.__Valid.init(['null']),
					partId: this.__Valid.init(['null']),
					ygMileage: this.__Valid.init(['null']),
					contactsName: this.__Valid.init(['null']),
					phone: this.__Valid.init(['phone', 'null']),
				},
				onSubmit: false,
				// 选中的日期
				dayList: [],
				timeTypeList: [
					{
						value: '0',
						name: '全部'
					}, {
						value: '1',
						name: '周一至周五'
					}, {
						value: '2',
						name: '周六日'
					}, {
						value: '3',
						name: '自定义'
					}
				],
				dates: {
					year: new Date().getFullYear(),
					month: new Date().getMonth() + 1
				},
				// 所有日期
				dayArr: [],
			}
		},
		methods: {
			submit() {
				new Promise((resolve) => {
					this.$refs.scheForm.validate(resolve)
				}).then(s => {
					if(0 == this.dayList.length) {
						this.$message.error('最少需要选择一天时间');
						return;
					}
					this.onSubmit = true;
					let data = JSON.parse(JSON.stringify(this.data));
					data.effMonth = this.dates.year + '-' +this.dates.month;
					data.effMonth = this.$root.$options.filters.dateFormat(new Date(data.effMonth), 'yyyy-MM');
					data.effDays = this.dayList.join(',')
					this.axios.post('/tms/aut/task/saveTask', data).then(res => {
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
			setSelectDay(type) {
				if('view' == this.params.todo) return;
				this.data.timeType = type;
				let arr = [],
					i = this.dayArr.length,
					today = new Date().getDate()
				if(0 == type) {
					while(i--) {
						if(this.dayArr[i] > today) {
							arr.push(this.dayArr[i])
						}
					}
					this.dayList = arr;
				} else if(1 == type) {
					let temp ;
					while(i--) {
						if(this.dayArr[i] > today) {
							temp = new Date(this.dates.year, this.dates.month -1, this.dayArr[i])
							if(0 != temp.getDay() && 6 != temp.getDay()) {
								arr.push(this.dayArr[i])
							}
						}
					}
					this.dayList = arr;
				} else if(2 == type) {
					let temp ;
					while(i--) {
						if(this.dayArr[i] > today) {
							temp = new Date(this.dates.year, this.dates.month -1, this.dayArr[i])
							if(0 == temp.getDay() || 6 == temp.getDay()) {
								arr.push(this.dayArr[i])
							}
						}
					}
					this.dayList = arr;
				} else if(3 == type) {
					this.dayList = []
				}
			}
		},
		mounted() {
			if('view' == this.params.todo) {
				this.__setValue(this.data, this.params.row);
				let data = this.params.row.effDays.split(','),
					i = data.length,
					arr = [];
				while(i--) {
					arr.push(data[i] * 1)
				}
				this.dayList = arr;
				this.__alertView(this.cols);
				this.baseRules = {}
			}
			this.dayArr = this.$refs.date.getDayList();
		}
	}
</script>
<style lang="stylus" scoped>
.date
	width: 720px
	.date-title
		height: 40px
		line-height: 40px
		margin-bottom: 10px
		.title
			font-size: 16px !important
			font-weight: bold
		.item
			width: 100px
			height: 40px
			display: inline-block
			text-align: center
			background-color: #d2d2d2
			margin-left: 10px
			cursor: pointer
			transition: all .3s
			border-radius: 4px
			&.active
				background-color: #1cbba7 !important
				color: #fff
.edit 
	position: absolute
	top: 51px
	left: 730px
	right: 10px
	bottom: 41px
	h1 
		font-size: 16px !important
		border-bottom: 1px solid #f2f2f2
		font-weight: bold
		height: 30px
</style>
