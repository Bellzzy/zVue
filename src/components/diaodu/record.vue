<!-- 调度记录 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">调度记录</div>
			<cc-search :cols='searchCols' :data='search'>
				<el-select v-model='search.state' slot='state'>
					<el-option label='全部' value=''></el-option>
					<el-option v-for='item,index in stateList' :key='index' :value='item.value' :label='item.name'></el-option>
				</el-select>
				<div class='opt' slot='opt'>
					<el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
					<el-button type='primary' :disabled='onExport' :loading='onExport' v-role='{rt: $route, type: "export"}'>导出</el-button>
					<el-button @click='__reset(search)' >重置</el-button>
				</div>
			</cc-search>
		</div>
		<cc-table :data='dataList' :cols='cols' :total='total' :settings='settings'
			@size-change='sizeChange' @current-change='currentChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='success' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
			</template>
		</cc-table>
	</div>
</template>
<script>
export default {
	data() {
		let self = this,
			ft = this.$root.$options.filters.dateFormat;
		return {
			search: {
				workNo: "",
				taskNo: '',
				cusId: "",
				orgId: "",
				cargoType: "",
				driver: "",
				plate: "",
				modelId: '',
				state: '',
				times: [ft(new Date()), ft(new Date())]
			},
			searchSettings: {
				span: 6,
				labelWidth: '80px'
			},
			searchCols: [
				{
					label: '工单号',
					prop: 'workNo',
				}, {
					label: '任务编号',
					prop: 'taskNo',
				}, {
					label: '客户简称',
					base: 'CUSTOMER',
					prop: 'cusId',
				}, {
					label: '所属公司',
					base: 'COMPANY',
					prop: 'orgId',
				}, {
					label: '货物类型',
					base: 'GOODSTYPE',
					prop: 'cargoType',
				}, {
					label: '驾驶员',
					prop: 'driver',
				}, {
					label: '车牌号',
					prop: 'plate',
				}, {
					label: '车型',
					dic: 'MODEL',
					prop: 'modelId',
				}, {
					label: '任务状态',
					slot: 'state',
				}, {
					label: '任务日期',
					prop: 'times',
					daterange: true,
				}, {
					label: '影像状态',
					prop: 'appImageType',
					select: true,
					option: [
						{
							value: '0',
							label: '未上传'
						}, {
							value: '1',
							label: '已上传'
						}
					]
				}
			],
			dataList: [],
			cols: [
			    {
					label: '工单号',
					prop: 'workNo',
				}, {
					label: '任务编号',
					prop: 'taskNo',
				}, {
					label: '客户简称',
					base: 'CUSTOMER',
					prop: 'cusId',
				}, {
					label: '客户所属分公司',
					width: 120,
					prop: 'cusId',
					format(val) {
						let orgId,
							list = self.__getBaseData('CUSTOMER'),
							i = list.length;
						while(i--) {
							if(val == list[i].id) {
								if(list[i].orgid) {
									return self.__getBaseData('COMPANY', list[i].orgid);
								}
							}
						}
						return ''
					}
				}, {
					label: '任务日期',
					prop: 'taskTime',
				}, {
					label: '车型',
					dic: 'MODEL',
					prop: 'modelId',
				}, {
					label: '取货仓库',
					prop: 'address',
				}, {
					label: '到仓时间',
					prop: 'arriveDate',
				}, {
					label: '货物类型',
					base: 'GOODSTYPE',
					prop: 'cargoType',
				}, {
					label: '联系人',
					prop: 'contactsName',
				}, {
					label: '联系电话',
					prop: 'phone',
				}, {
					label: '驾驶员',
					prop: 'driver',
				}, {
					label: '驾驶员电话',
					width: 100,
					prop: 'driverPhone',
				}, {
					label: '车牌号',
					prop: 'plate',
				}, {
					label: '所属公司',
					prop: 'orgId',
					base: 'COMPANY'
				}, {
					label: '任务状态',
					prop: 'state',
					format(val) {
						let list = self.stateList,
							i = list.length;
						while(i--) {
							if(val == list[i].value) {
								return list[i].name;
							}
						}
						return val;
					}
				}, {
					label: '影像状态',
					prop: 'appImageType',
					radio: true,
					list: [
						{
							value: '0',
							name: '未上传'
						}, {
							value: '1',
							name: '已上传'
						}
					]
				}, {
					label: '操作',
					slot: 'opt',
				}
			],
			settings: {
				select: 'checkbox',
				showOrderNo: true,
			},
			onQuery: false,
			query: {
				rows: this.__rows,
				page: 1
			},
			total: 0,
			onUpload: false,
			onExport: false,
			stateList: [
				{
					value: '0',
					name: '待确认'
				}, {
					value: '1',
					name: '待开始'
				}, {
					value: '2',
					name: '已开始'
				}, {
					value: '3',
					name: '已状态'
				}, {
					value: '4',
					name: '配送中'
				}, {
					value: '5',
					name: '异常终止'
				}, {
					value: '6',
					name: '正常结束'
				}, {
					value: '7',
					name: '取消'
				}
			]
		}
	},
	methods: {
		alert(todo, row) {
			let title = '新增货的';
			if('edit' == todo) {
				title = '编辑货的'
			} else if ('view' == todo) {
				title = '查看货的'
			}
			new Promise(resolve => {
				this.$emit('openAlert', {
					title: title,
					width: '1000px',
					height: '600px',
					url: '/diaodu/temp/record_det.vue',
					props: {
						row: row,
						todo: todo,
						callback: resolve
					}
				})
			}).then(_ => {
				this.getData();
			})
		},
		getData() {
			this.onQuery = true;
			let data = Object.assign({}, this.query, this.search);
			if(data.times.length) {
				data.taskTime = data.times[0] + ' 00:00:00';
				data.endTime = data.times[1] + ' 23:59:59';
			}
			delete data.times;
			this.axios.post('/tms/dispatch/getDispacthHistoryList', data).then(res => {
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
		clear() {
			for(let item in this.search) {
				this.search[item] = ''
			}
		},
		exportData() {
			this.onExport = true;
			this.axios.post('/ecargo/goodsDocController/exportGoodsDoc', this.search).then(res => {
				if(200 == res.code) {
					this.$message.success(res.msg)
					this.getData();
				}
				this.onExport = false;
			}).catch(err => {
				this.onExport = false;
			})
		}
	},
	mounted() {
		this.getData();
	}
}
</script>
<style lang="stylus" scoped>
.taskdate
	width: 70px
	display: inline-block
	text-align: right
	margin-right: 3px
</style>
