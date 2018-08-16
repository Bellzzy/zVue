<!-- 帮助设置 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">帮助设置</div>
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
				<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>修改</el-button>
				<el-button type='text' @click='rowOpt(scope.row, "hide")' :disabled='scope.row.onHiding' :loading='scope.row.onHiding' v-role='{rt: $route, type: "edit"}'>{{0 == scope.row.helpStatus ? "显示" : "隐藏"}}</el-button>
				<el-button type='text' @click='rowOpt(scope.row, "del")' :disabled='scope.row.onDeleting' :loading='scope.row.onDeleting' v-role='{rt: $route, type: "delete"}'>删除</el-button>
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
				helpTitle: '',
				times: '',
				helpStatus: ''
			},
			searchCols: [
				{
					label: '标题',
					input: true,
					prop: 'helpTitle',
				}, {
					label: '创建日期',
					daterange: true,
					prop: 'times'
				}, {
					label: '状态',
					select: true,
					prop: 'helpStatus',
					option: [
						{
							label: '隐藏',
							value: 0
						}, {
							label: '显示',
							value: 1
						}
					]
				}
			],
			dataList: [],
			cols: [
				{
					label: '标题',
					prop: 'helpTitle',
				}, {
					label: '创建日期',
					prop: 'crtDate',
				}, {
					label: '状态',
					prop: 'helpStatus',
					format(val) {
						if(0 == val) {
							return '隐藏'
						}
						if(1 == val) {
							return '显示'
						}
						return val;
					}
				}, {
					label: '操作',
					width: 200,
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
			let title = '新增设置';
			if('edit' == todo) {
				title = '编辑设置'
			} else if ('view' == todo) {
				title = '查看设置'
			}
			let self = this;
			new Promise(resolve => {
				this.$emit('openAlert', {
					width: '1000px',
					height: '660px',
					title: title,
					url: '/app/temp/help_det.vue',
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
			if(data.times.length) {
				data.endCrtDate = data.times[1];
				data.startCrtDate = data.times[0];
			}
			delete data.times;
			this.axios.post('/help/queryHelpByPage', data).then(res => {
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
		rowOpt(row, opt) {
			let url;
			if('del' == opt) {
				url = '/help/delHelp';
				this.$set(row, 'onDeleting', true)
			}
			if('hide' == opt) {
				url = '/help/changeHelpStatus';
				this.$set(row, 'onHiding', true)
			}
			this.axios.get(url, {params: {id: row.id}}).then(res => {
				if(200 == res.code) {
					if('del' == opt) {
						let i = this.dataList.length;
						while(i--) {
							if(row.id == this.dataList[i].id) {
								this.dataList.splice(i, 1);
								break;
							}
						}
					}
					if('hide' == opt) {
						row.helpStatus = 0 == row.helpStatus ? 1 : 0; 
					}
				}
				this.$delete(row, 'onDeleting')
				this.$delete(row, 'onHiding')
			}).catch(err => {
				this.$delete(row, 'onDeleting')
				this.$delete(row, 'onHiding')
			})
		},
	},
	mounted() {
		this.getData();
	}
}
</script>
