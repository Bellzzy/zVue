<!-- 货物类型 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">货物类型</div>
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
					typename: ''
				},
				searchCols: [
					{
						label: '类型名称',
						prop: 'typename'
					}
				],
				dataList: [],
				cols: [
					{
						label: '类型编号',
						prop: 'typeno'
					}, {
						label: '类型名称',
						prop: 'typename'
					}, {
						label: '备注',
						prop: 'remark'
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
		        this.axios.post('/GoodsTypeController/GoodsTypequeryGoods', data).then(res => {
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
				let title = '新增货物类型';
				if('edit' == todo) {
					title = '修改货物类型'
				} else if ('view' == todo) {
					title = '查看货物类型'
				}
				new Promise(resolve => {
					this.$emit('openAlert', {
						width: '400px',
						height: '300px',
						title: title,
						url: '/base/temp/goodstype_det.vue',
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
