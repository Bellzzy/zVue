<!-- 日常调度 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">日常调度任务</div>
			<div style='padding: 10px'>
				<cc-date style='margin: auto' :ifChangeMonth='true' @monthChange='monthChange'>
					<span v-for='item,index in countList' :key='index' :slot='dates.year+"-"+dates.month+"-"+(index+1)' slot-scope='scope' class='slot' :class='setClass(scope.date)' @click='selectDay(scope.date)'>
						{{item.count}}
					</span>
				</cc-date>
				<div class='mark'>
					<div><i class='uncomplete'></i>未完成</div>
					<div><i class='complete'></i>已完成</div>
					<div><i class='select'></i>当前选中</div>
				</div>
			</div>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
				<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "paiban"}' v-if='btnFlag(scope.row)'>排班</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
	export default {
		data() {
			let self = this,
				ft = self.$root.$options.filters.dateFormat;
			return {
				activeDay: new Date().getDate(),
				checkList: [2,3,6],
				dataList: [],
				cols: [
					{
						label: '任务编号',
						prop: 'taskNo'
					}, {
						label: '客户名称',
						prop: 'cusId',
						base: 'CUSTOMER'
					}, {
						label: '任务日期',
						prop: 'taskTime'
					}, {
						label: '所需车型',
						prop: 'modelId',
						dic: 'MODEL'
					}, {
						label: '点部名称',
						prop: 'partId',
						base: 'POINT'
					}, {
						label: '取货地址',
						prop: 'address'
					}, {
						label: '到仓时间',
						prop: 'arriveDate'
					}, {
						label: '里程(km)',
						prop: 'ygMileage'
					}, {
						label: '客户联系人',
						width: 100,
						prop: 'contactsName'
					}, {
						label: '联系电话',
						width: 100,
						prop: 'phone'
					}, {
						label: '状态',
						prop: 'taskState',
						format(val) {
							switch(val+"") {
								case '0': return '待排班';
								case '1': return '已排班';
								case '2': return '已取消';
							}
						}
					}, {
						label: '操作',
						width: 120,
						slot: 'opt'
					}
				],
				settings: {},
				total: 0,
				onQuery: false,
				onExport: false,
				flag: false,
				query: {
					page: 1,
					rows: 50
				},
				dates: {
					year: new Date().getFullYear(),
					month: new Date().getMonth() + 1
				},
				countList: []
			}
		},
		methods: {
			getData() {
				this.onQuery = true;
				let ft = this.$root.$options.filters.dateFormat;
				let data = {
					taskTime: ft(new Date(this.dates.year, this.dates.month - 1, this.activeDay))
				};
				data = Object.assign(data, this.query);
				this.axios.post('/tms/dispatch/getDispatchList', data).then(res => {
					if(200 == res.code) {
						this.dataList = res.data || [];
						this.total = res.count;
					}
					this.onQuery = false;
				}).catch(err => {
					this.onQuery = false;
				})
			},
			alert(todo, row) {
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '1000px',
						height: '600px',
						title: '日常排班',
						url: '/diaodu/temp/daily_det.vue',
						props: {
							row: row,
							todo: todo,
							callback: resolve
						}
					})
				}).then(_=>{
					this.getData()
				})
			},
			sizeChange(pageSize) {
				this.query.rows = pageSize;
			},
			currentChange(page) {
				this.query.page = page;
			},
			dayClick(obj) {
				let date = obj.year + '-' + (obj.month+1) + '-' + obj.day;
				this.activeDay = this.$root.$options.filters.dateFormat(date);
				this.getData();
			},
			monthChange(obj) {
				this.dates = obj;
				this.activeDay = '';
				this.getCount();
			},
			setClass(obj) {
				if(obj.year == this.dates.year && obj.month == this.dates.month && obj.day == this.activeDay) {
					return 'select'
				} else {
					let ft = this.$root.$options.filters.dateFormat,
						today = +new Date(ft(new Date())),
						tempDate = +new Date(ft(new Date(obj.year, obj.month -1, obj.day)))
					if(tempDate > today) {
						return 'uncomplete'
					}
					return 'complete'
				}
			},
			btnFlag(row) {
				let ft = this.$root.$options.filters.dateFormat,
				today = +new Date(ft(new Date)),
				tempDate = +new Date(ft(new Date(row.taskTime)))
				if ("1" == row.isCancel) {
					this.flag = false 
				} else {
					if(tempDate >= today) {
						this.flag = true
					} else {
						this.flag = false						
					}
				}
				return this.flag
			},
			selectDay(obj) {
				this.activeDay = obj.day;
				this.getData();
			},
			getCount() {
				this.axios.post('/tms/dispatch/getIsStateCount', this.dates).then(res => {

					if(200 == res.code) {
						this.countList = res.data;
					}
				})
			},
			getCountByDate() {

			}
		},
		mounted() {
			this.getData();
			this.getCount()
		},
		watch: {
			checkList(n) {
				console.log(n)
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.uncomplete
		background-color: red
	.complete
		background-color: #1cbba7
	.select
		background-color: #f90
	.slot
		display:inline-block
		width: 100%
		height: 100%
	.mark 
		position: absolute
		left: 50%
		margin-left: 360px
		bottom: 10px
		>div
			height: 20px
			margin-top: 10px
			line-height: 20px
			i
				width: 20px
				height: 20px
				display: inline-block
				margin-right: 10px
				vertical-align: top
				
</style>
