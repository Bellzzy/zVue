<!-- 自动设置任务 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">自动任务条件设置</div>
			<cc-search :cols='searchCols' :data='search'>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button @click='__reset(search)'>重置</el-button>
				</div>
				<el-select v-model='search.timeType' slot='timeType'>
					<el-option label='请选择' value=''></el-option>
					<el-option v-for='item,index in timeTypeList' :key='index' :label='item.name' :value='item.value'></el-option>
				</el-select>
			</cc-search>
			<el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
	export default {
		data() {
			let self = this;
			return {
				search: {
					cusId: '',
					timeType: ''
				},
				searchCols: [
					{
						label: '客户简称',
						prop: 'cusId',
						base: 'CUSTOMER'
					}, {
						label: '日期类型',
						slot: 'timeType'
					}
				],
				dataList: [],
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
				cols: [
					{
						label: '自动任务日期类型',
						width: 120,
						prop: 'timeType',
						format(val) {
							let i = self.timeTypeList.length;
							while(i--) {
								if(val == self.timeTypeList[i].value) {
									return self.timeTypeList[i].name;
								}
							}
							return val;
						}
					}, {
						label: '客户名称',
						prop: 'cusId',
						base: 'CUSTOMER'
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
						label: '取货联系人',
						width: 100,
						prop: 'contactsName'
					}, {
						label: '取货联系方式',
						width: 120,
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
						label: '到达区域',
						prop: 'endRegion',
						base: 'REGIONS'
					}, {
						label: '创建日期',
						prop: 'crtDate',
						format(val) {
							return self.$root.$options.filters.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
						}
					}, {
						label: '操作',
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
				}
			}
		},
		methods: {
			getData() {
				this.onQuery = true;
				let data =Object.assign({}, this.search, this.query);
				this.axios.post('/tms/aut/task/getAutTaskList', data).then(res => {
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
				let title = '新增自动任务设置';
				if ('view' == todo) {
					title = '查看自动任务设置'
				}
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '1300px',
						height: '650px',
						title: title,
						url: '/customer/temp/auto_det.vue',
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

			},
			currentChange(page) {

			},
		},
		mounted() {
			this.getData()
		}
	}
</script>
