<!-- 业务员信息 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">业务员信息</div>
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
				<el-button type='text' @click='changeState(scope.row)' v-role='{rt: $route, type: "edit"}'>{{0 == scope.row.state ? '启用' : '禁用'}}</el-button>
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
					name: '',
					orgid: ''
				},
				searchCols: [
					{
						label: '姓名',
						prop: 'name'
					}, {
						label: '所属公司',
						prop: 'orgid',
						base: 'COMPANY'
					}
				],
				dataList: [],
				cols: [
					{
						label: '姓名',
						prop: 'name'
					}, {
						label: '性别',
						prop: 'sex',
						radio: true,
						list: [
							{
								name: '男',
								value: '1'
							}, {
								name: '女',
								value: '0'
							}
						]
					}, {
						label: '身份证号',
						prop: 'identityno'
					}, {
						label: '文化程度',
						prop: 'culture'
					}, {
						label: '联系电话',
						prop: 'phone'
					}, {
						label: '所属公司',
						prop: 'orgid',
						base: 'COMPANY'
					}, {
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
						width: 150,
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
				},
			}
		},
		methods: {
			getData() {
		        this.onQuery = true;
		        let data =Object.assign({}, this.search, this.query);
		        this.axios.post('/SalesmanController/querySaleman', data).then(res => {
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
				let title = '新增业务员';
				if('edit' == todo) {
					title = '修改业务员'
				} else if ('view' == todo) {
					title = '查看业务员'
				}
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '320px',
						height: '400px',
						title: title,
						url: '/cus_management/temp/salesman_det.vue',
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
			changeState(obj) {
				let title = '是否要启用该帐户?',
					state = 1;
				if(1 == obj.state) {
					title = '是否要禁用该帐户?';
					state = 0
				}
				this.__confirm(this, title, '', {
					beforeClose(act, ins, done) {
						if('confirm' == act) {
							ins.confirmButtonLoading = true;
							this.axios.post('/SalesmanController/updateState', {
								id: obj.id, state: state
							}).then(res => {
								if(200 == res.code) {
									this.$message.success(res.msg);
									obj.state = state;
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
					}
				}).catch(err => {})
			}
		},
		mounted() {
			this.getData();
		}
	}
</script>
