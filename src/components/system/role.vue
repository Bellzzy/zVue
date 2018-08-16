<!-- 角色管理 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">角色管理</div>
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
		return {
			search: {},
			searchCols: [
				{
					label: '角色名',
					input: true,
					prop: 'roleName'
				}
			],
			dataList: [],
			cols: [
				{
					label: '角色名',
					prop: 'roleName'
				}, {
					label: '角色描述',
					prop: 'roleDesc'
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
				showOrderNo: true
			}
		}
	},
	methods: {
		alert(todo, row) {
			let title = '新增角色';
			if('edit' == todo) {
				title = '编辑角色'
			} else if ('view' == todo) {
				title = '查看角色'
			}
			new Promise(resolve => {
				this.$emit('openAlert', {
					width: '1000px',
					height: '600px',
					title: title,
					url: '/system/temp/role_det.vue',
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
		getData() {
			this.onQuery = true;
			let data = Object.assign({}, this.query, this.search);
			this.axios.post('/user/role/getList', data).then(res => {
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
			this.axios.post('/user/role/delete', {id: row.id}).then(res => {
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
