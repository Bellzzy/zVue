<!-- 客户信息列表 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">客户信息管理</div>
			<cc-search :cols='searchCols' :data='search'>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button @click='__reset(search)'>重置</el-button>
				</div>
			</cc-search>
			<el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
				<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>修改</el-button>
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
					cusname: '',
					cusbusiness: ''
				},
				searchCols: [
					{
						label: '客户全称',
						prop: 'cusname'
					}, {
						label: '对接业务员',
						prop: 'cusbusiness',
						base: 'SALESMAN'
					}
				],
				dataList: [],
				cols: [
					{
						label: '客户全称',
						prop: 'cusname'
					}, {
						label: '客户简称',
						prop: 'cusshort'
					}, {
						label: '客户联系人',
						prop: 'contactp'
					}, {
						label: '联系电话',
						prop: 'phone'
					}, {
						label: '客户地址',
						width: 200,
						prop: 'cusadderss'
					}, {
						label: '结算方式',
						prop: 'ismode',
						dic: 'PAYTYPE'
					}, {
						label: '对接业务员',
						width: 100,
						prop: 'cusbusiness',
						base: 'SALESMAN'
					}, {
						label: '项目负责人',
						width: 100,
						base: 'PM',
						prop: 'businessperson'
					}, {
						label: '客户所属机构',
						prop: 'orgid',
						base: 'COMPANY'
					},{
						label: '状态',
						prop: 'state',
						radio: true,
						list: [
							{
								name: '禁用',
								value: '0'
							}, {
								name: '启用',
								value: '1'
							}
						]
					}, {
						label: '操作',
						width: 120,
						slot: 'opt'
					}
				],
				settings: {
					showOrderNo: true
				},
				total: 0,
				onQuery: false,
				onExport: false,
				query: {
					page: 1,
					rows: this.__rows
				}
			}
		},
		methods: {
			getData() {
		        this.onQuery = true;
		        let data =Object.assign({}, this.search, this.query);
		        this.axios.post('/customerController/querycustomer', data).then(res => {
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
				let title = '新增客户信息';
				if('edit' == todo) {
					title = '修改客户信息'
				} else if ('view' == todo) {
					title = '查看客户信息'
				}
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '800px',
						height: '400px',
						title: title,
						url: '/cus_management/temp/detail.vue',
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
		},
		mounted() {
			this.getData();
		}
	}
</script>
