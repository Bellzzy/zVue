<!-- 操作日志 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">操作日志</div>
		</div>
		<cc-table :data='dataList' :cols='cols' :settings='settings' :total='total'  
			@size-change='sizeChange' @current-change='currentChange'>
		</cc-table>
	</div>
</template>
<script>
export default {
	data() {
		let  self = this;
		return {
			dataList: [],
			cols: [
				{
					label: '用户名',
					prop: ''
				}, {
					label: '登入时间',
					prop: ''
				}, {
					label: '退出时间',
					prop: '',
				}, {
					label: '备注',
					prop: '',
				}, {
					label: '登录IP',
					prop: 'roleId',
				}, {
					label: '登录地址',
					radio: true,
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
		getData() {
			// TODO
			// 
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
