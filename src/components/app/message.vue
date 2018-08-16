<!-- 消息推送 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">消息推送</div>
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
				pushType: '',
				pushAccount: '',
			},
			searchCols: [
				{
					label: '推送类型',
					select: true,
					prop: 'pushType',
					option: [
						{
							label: '全体货运师',
							value: 1
						}, {
							label: '内部货运师',
							value: 2
						}, {
							label: '外部货运师',
							value: 3
						}, {
							label: '单个货运师',
							value: 4
						}
					]
				}, {
					label: '接收账号',
					input: true,
					prop: 'pushAccount'
				}
			],
			dataList: [],
			cols: [
				{
					label: '推送类型',
					prop: 'pushType',
					format(val) {
						switch(val) {
							case 1: return '全体货运师';
							case 2: return '内部货运师';
							case 3: return '外部货运师';
							case 4: return '单个货运师';
							default: return val;
						}
					},
				}, {
					label: '推送方式',
					prop: 'pushWay',
					radio: true,
					list: [
						{
							value: '2',
							name: 'APP通知'
						}, {
							value: '1',
							name: '短信'
						}
					]
				}, {
					label: '接收账号',
					prop: 'pushAccount',
				}, {
					label: '推送内容',
					prop: 'pushContent',
				}, {
					label: '发送时间',
					prop: 'pushTime',
					filter: 'dateFormat',
					filterParams: 'yyyy-MM-dd hh:mm:ss'
				}, {
					label: '状态',
					prop: 'pushStatus',
					format(val) {
						return '0' == val ? '失败' : '成功';
					}
				}, {
					label: '操作',
					width: 80,
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
			let title = '新增消息推送';
			if('edit' == todo) {
				title = '编辑消息推送'
			} else if ('view' == todo) {
				title = '查看消息推送'
			}
			let self = this;
			new Promise(resolve => {
				this.$emit('openAlert', {
					width: '400px',
					height: '420px',
					title: title,
					url: '/app/temp/message_det.vue',
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
			this.axios.post('/tmsMessagePush/queryMessagePushByPage', data).then(res => {
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
		}
	},
	mounted() {
		this.getData();
	}
}
</script>
