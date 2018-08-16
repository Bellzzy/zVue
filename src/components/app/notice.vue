<!-- 公告 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">APP公告</div>
			<!-- <cc-search :cols='searchCols' :data='search'>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button @click='__reset(search)' >重置</el-button>
				</div>
			</cc-search> -->
			<div class='main-search__body'></div>
			<el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
				<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>编辑</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
export default {
	data() {
		let  self = this;
		return {
			// search: {
			// 	type: '',
			// 	ids: '',
			// },
			// searchCols: [
			// 	{
			// 		label: '推送类型',
			// 		input: true,
			// 		prop: 'type'
			// 	}, {
			// 		label: '接收账号',
			// 		input: true,
			// 		prop: 'ids'
			// 	}
			// ],
			dataList: [],
			cols: [
				{
					label: '标题',
					prop: 'bulletinTitle'
				}, {
					label: '公告内容',
					prop: 'bulletinContent'
				}, {
					label: '展示开始时间',
					prop: 'startShowTime',
				}, {
					label: '展示结束时间',
					prop: 'endShowTime',
				}, {
					label: '创建日期',
					prop: 'crtDate',
					filter: 'dateFormat',
					filterParams: 'yyyy-MM-dd hh:mm:ss'
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
			let title = '新增公告';
			if('edit' == todo) {
				title = '编辑公告'
			} else if ('view' == todo) {
				title = '查看公告'
			}
			let self = this;
			new Promise(resolve => {
				this.$emit('openAlert', {
					width: '1000px',
					height: '760px',
					title: title,
					url: '/app/temp/notice_det.vue',
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
			let data = Object.assign({}, this.query, this.search);
			this.onQuery = true;
			this.axios.post('/tmsAppBulletin/queryTmsAppBulletinByPage', data).then(res => {
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
	},
	mounted() {
		this.getData();
	}
}
</script>
