<!-- 任务需求 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">任务需求列表</div>
			<cc-search :cols='searchCols' :data='search'>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button @click='__reset(search)'>重置</el-button>
				</div>
				<el-select v-model='search.taskState' slot='taskState'>
					<el-option label='请选择' value=''></el-option>
					<el-option v-for='(item,index) in stateList' :key='index' :value='item.value' :label='item.name'></el-option>
				</el-select>
				<el-select v-model='search.isCancel' slot='isCancel'>
					<el-option label='请选择' value=''></el-option>
					<el-option v-for='(item,index) in cancelList' :key='index' :value='item.value' :label='item.name'></el-option>
				</el-select>
			</cc-search>
			<el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)'>查看</el-button>
				<el-button type='text' @click='alert("edit", scope.row)'
				v-if='("1" != scope.row.isCancel) && ("0" ==scope.row.taskState)'
				>修改</el-button>
				<el-button v-role='{rt: $route, type: "cancel"}' v-if='"0" == scope.row.isCancel' type='text' @click='cancel(scope.row)'>取消</el-button>
				<el-button type='text' v-role='{rt: $route, type: "add"}' @click='copy(scope.row)' :disabled='scope.row.onCopy' :loading='scope.row.onCopy'>复制</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
	export default {
		data() {
			let ft = this.$root.$options.filters.dateFormat;
			return {
				search: {
					times: [ft(new Date()), ft(new Date())],
					cusId: '',
					cargoType: '',
					taskState: '',
					partId: '',
					isCancel: ''
				},
				searchCols: [
					{
						label: '任务日期',
						prop: 'times',
						daterange: true,
						// 开始日期taskTime,结束日期endTime
					}, {
						label: '客户简称',
						prop: 'cusId',
						base: 'CUSTOMER'
					}, {
						label: '货物类型',
						prop: 'cargoType',
						base: 'GOODSTYPE'
					}, {
						label: '任务状态',
						slot: 'taskState',
					}, {
						label: '取货点部',
						prop: 'partId',
						base: 'POINT'
					}, {
						label: '是否取消',
						slot: 'isCancel',
					}
				],
				stateList: [
					{
						value: '0',
						name: '待排班'
					}, {
						value: '1',
						name: '已排班'
					}
				],
				cancelList: [
					{
						value: '0',
						name: '否'
					}, {
						value: '1',
						name: '是'
					}
				],
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
						prop: 'taskTime',
						filter: 'dateFormat'
					}, {
						label: '到仓时间',
						prop: 'arriveDate'
					}, {
						label: '所需车型',
						prop: 'modelId',
						dic: 'MODEL'
					}, {
						label: '取货点部',
						prop: 'partId',
						base: 'POINT'
					}, {
						label: '取货地址',
						prop: 'address'
					}, {
						label: '联系人',
						prop: 'contactsName'
					}, {
						label: '联系电话',
						prop: 'phone'
					}, {
						label: '货物类型',
						prop: 'cargoType',
						base: 'GOODSTYPE'
					}, {
						label: '起始区域',
						prop: 'startRegion',
						base: 'REGIONS'
					}, {
						label: '送达区域',
						prop: 'endRegion',
						base: 'REGIONS'
					// }, {
					// 	label: '预估里程(km)',
					// 	width: 100,
					// 	prop: 'ygMileage'
					}, {
						label: '状态',
						prop: 'taskState',
						radio: true,
						list: [
							{
								value: '0',
								name: '待排班'
							}, {
								value: '1',
								name: '已排班'
							}
						]
					}, {
						label: '驾驶员',
						prop: 'driverName'
					}, {
						label: '电话',
						prop: 'driverPhone'
					}, {
						label: '是否取消',
						prop: 'isCancel',
						radio: true
					}, {
						label: '操作',
						width: 200,
						slot: 'opt'
					}
				],
				settings: {
					showOrderNo: true
				},
				total: 0,
				onQuery: false,
				query: {
					page: 1,
					rows: 50
				},
			}
		},
		methods: {
			getData() {
				this.onQuery = true;
				let data =Object.assign({}, this.search, this.query);
				if(data.times.length) {
					data.taskTime = data.times[0] + ' 00:00:00';
					data.endTime = data.times[1] + ' 23:59:59';
				}
				delete data.times;
				this.axios.post('/tms/task/getTaskList', data).then(res => {
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
				let title = '新增任务需求';
				if('edit' == todo) {
					title = '修改任务需求'
				} else if ('view' == todo) {
					title = '查看任务需求'
				}
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '600px',
						height: '480px',
						title: title,
						url: '/customer/temp/task_det.vue',
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
				this.getData();
			},
			currentChange(page) {
				this.query.page = page;
				this.getData();
			},
			copy(row) {
				this.$set(row, 'onCopy', true)
				let data = JSON.parse(JSON.stringify(row));
				delete data.id;
				this.axios.post('/tms/task/saveTask', data).then(res => {
					if(200 == res.code) {
						this.$message.success(res.msg);
						this.getData();
					}
					this.$delete(row, 'onCopy')
				}).catch(err => {
					this.$delete(row, 'onCopy')
				})
			},
			cancel(row) {
				this.__confirm(this, '取消原因', '', {
					showInput: true,
					inputType: 'textarea',
					beforeClose: (act, ins, done) => {
						if('confirm' == act) {
							ins.confirmButtonLoading = true;
							let cancelReason = ins.inputValue;
							if(!cancelReason) {
								this.$message.error('请输入取消原因');
								ins.confirmButtonLoading = false;
								return;
							}
							this.axios.post('/tms/task/delTask', {
								id: row.id,
								taskNo: row.taskNo,
								cancelReason: cancelReason
							}).then(res => {
								if(200 == res.code) {
									this.$message.success(res.msg);
									this.getData();
								}
								ins.confirmButtonLoading = false;
								done();
							}).catch(err => {
								ins.confirmButtonLoading = false;
								done();
							})
						} else {
							done();
						}
					},
				}).catch(_ => {})
			}
		},
		mounted() {
			this.getData();
		}
	}
</script>
