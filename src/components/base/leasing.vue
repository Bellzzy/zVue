<!-- 租赁公司管理 -->
<template>
	<div class='main'>
	    <div class="main-search" v-split>
			<div class="main-search__title">租赁公司管理</div>
			<cc-search :cols='searchCols' :data='search'>
				<div class="opt" slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
            		<el-button type='primary' @click='reset'>重置</el-button>
					<el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
			          <i class="el-icon-plus"></i>新增
			        </el-button>
				</div>
			</cc-search>
		</div>
		<cc-table :data='dataList' :cols='cols' :total='total' :settings='settings' @size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' v-role='{rt: $route, type: "edit"}' @click='alert("edit", scope.row)'>修改</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
export default {
	data() {
		return {
			search: {},
			searchCols: [{
				label: '车辆品牌',
				prop: 'plate',
				input: true
			},{
				label: '租赁公司名称',
				prop: 'leaseName',
				input: true
			}],
			dataList: [{}],
			cols: [{
				label: '租赁公司编号',
				prop: 'number',
				base: 'LEASING'
			},{
				label: '租赁公司名称',
				prop: 'leaseName',
			},{
				label: '车辆品牌',
				prop: 'band'
			},{
				label: '操作',
				slot: 'opt'
			}],
			settings: {
          		showOrderNo: true,
        	},
        	query: {
	          page: 1,
	          rows: this.__rows
	        },
			onQuery: false,
			total: 0
		}
	},
	methods: {
		getData() {
			this.onQuery = true;
			let data = Object.assign({}, this.search, this.query);
			this.axios.post('/data/queryLeaseInfoByPage', data).then(res => {
				this.onQuery = false;
				if(200 == res.code) {
					this.dataList = res.data || [];
					this.total = res.count;
				}
			}).catch(err => {
				this.onQuery = false
			})
		},
		reset() {
			this.__reset(this.search)
		},
		alert(todo, row) {
			let title = '';
			if( 'add' == todo) {
				title = '新增租赁公司信息';
				this.axios.get('/data/getNumberByType', {params: {type: 4}}).then(res => {
					row.number = res.data
				})
			} 
			if('edit' == todo) {
				title = '修改租赁公司信息';
			} else if('view' == todo) {
				title = '查看租赁公司信息'
			}
			new Promise(resolve => {
				this.$emit('openAlert' , {
					width: '350px',
					height: '300px',
					title: title,
					url: '/base/temp/leasing_det.vue',
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
	        this.getData()
	      },
	},
	mounted() {
		this.getData()
	}
}
</script>