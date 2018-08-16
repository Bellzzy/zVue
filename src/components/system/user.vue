<!-- 用户管理 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">用户管理</div>
			<cc-search :cols='searchCols' :data='search'>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button @click='__reset(search)' >重置</el-button>
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
				<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>编辑</el-button>
				<el-button type='text' @click='delRow(scope.row)' :disabled='scope.row.onDelete' :loading='scope.row.onDelete' v-role='{rt: $route, type: "delete"}'>删除</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
export default {
	data() {
		let  self = this;
		return {
			search: {
				userName: '',
				company: '',
				statu: ''
			},
			searchCols: [
				{
					label: '用户名',
					input: true,
					prop: 'userName'
				}, {
					label: '所属公司',
					base: 'COMPANY',
					prop: 'company'
				}, {
					label: '状态',
					prop: 'statu',
					radio: true,
					list: [
						{
							name: '正常',
							value: '0'
						}, {
							name: '禁用',
							value: '1'
						}
					]
				}
			],
			dataList: [],
			cols: [
				{
					label: '用户名',
					prop: 'userName'
				},{
					label: '用户姓名',
					prop: 'chineseName'
				}, {
					label: '联系方式',
					prop: 'mobilePhone'
				}, {
					label: '邮箱',
					prop: 'email',
				}, {
					label: '所属公司',
					prop: 'company',
					base: 'COMPANY'
				}, {
					label: '所属客户',
					prop: 'cusId',
					base: 'CUSTOMER'
				}, {
					label: '角色',
					prop: 'roleId',
					base: 'ROLE'
				}, {
					label: '状态',
					radio: true,
					prop: 'statu',
					format(val) {
						return '0' == val ? '正常' : '禁用';
					}
				}, {
					label: '操作',
					width: 160,
					slot: 'opt'
				}
			],
			total: 0,
			query: {
				page: 1,
				rows: this.__rows
			},
			onQuery: false,
			settings: {
				showOrderNo: true,
			}
		}
	},
	methods: {
		alert(todo, row) {
			let title = '新增用户';
			if('edit' == todo) {
				title = '编辑用户'
			} else if ('view' == todo) {
				title = '查看用户'
			}
			let self = this;
			new Promise(resolve => {
				this.$emit('openAlert', {
					width: '600px',
					height: '300px',
					title: title,
					url: '/system/temp/user_det.vue',
					props: {
						row: row,
						todo: todo,
						callback: resolve
					}
				})
			}).then((arg)=>{
				this.getData()
			})
		},
		getData() {
			this.onQuery = true;
			let data = Object.assign({}, this.query, this.search);
			this.axios.post('/user/usercontroller/getUserList', data).then(res => {
				this.onQuery = false;
				if(200 == res.code) {
					this.dataList = res.data;
					this.total = res.count;
				}
			}).catch(err => {
				this.onQuery = false;
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
		delRow(row) {
			this.$set(row, 'onDelete', true)
			this.axios.post('/user/usercontroller/deleteUser', {id: row.id}).then(res => {
				if(200 == res.code) {
					this.$message.success(res.msg);
					this.getData();
				}
				this.$delete(row, 'onDelete')
			}).catch(err => {
				this.$delete(row, 'onDelete')
			})
		}
	},
	mounted() {
		this.getData();
	}
}
</script>
