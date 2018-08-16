<!-- 日运营任务填报 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">日营运任务填报</div>
			<cc-search :cols='searchCols' :data='search'> 
		           <template slot='money'>
		              <el-input v-model='search.startMoney' class='min'></el-input>
		              ~
		              <el-input v-model='search.endMoney' class='min'></el-input>
		          </template>
		           <template slot='SpeelCost'>
		              <el-input v-model='search.startSpeelCost' class='min'></el-input>
		              ~
		              <el-input v-model='search.endSpeelCost' class='min'></el-input>
		          </template>
		           <template slot='HamalCost'>
		              <el-input v-model='search.startHamalCost' class='min'></el-input>
		              ~
		              <el-input v-model='search.endHamalCost' class='min'></el-input>
		          </template>
		          <template slot='SubsidyCost'>
		              <el-input v-model='search.startSubsidyCost' class='min'></el-input>
		              ~
		              <el-input v-model='search.endSubsidyCost' class='min'></el-input>
		          </template>
		           <template slot='ArriveDate'>
		              <el-input v-model='search.startArriveDate' class='min'></el-input>
		              ~
		              <el-input v-model='search.endArriveDate' class='min'></el-input>
		          </template>
		           <template slot='ParkingCost'>
		              <el-input v-model='search.startParkingCost' class='min'></el-input>
		              ~
		              <el-input v-model='search.endParkingCost' class='min'></el-input>
		          </template>
		           <template slot='PleaseCost'>
		              <el-input v-model='search.startPleaseCost' class='min'></el-input>
		              ~
		              <el-input v-model='search.endPleaseCost' class='min'></el-input>
		          </template>
			 <div class='opt' slot='opt'>
                <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
                <el-button type='primary' @click='reset'>重置</el-button>
                <el-button type='primary' v-role='{rt: $route, type: "edit"}' @click='edit("GSF")' :disabled='onGSF' :loading='onGSF'>批量修改高速费报销状态</el-button>
                <el-button type='primary' v-role='{rt: $route, type: "edit"}' @click='edit("TCF")' :disabled='onTCF' :loading='onTCF'>批量修改停车费报销状态</el-button>
                <el-button type='primary' v-role='{rt: $route, type: "edit"}' @click='edit("MONEY")' :disabled='onMONEY' :loading='onMONEY'>批量修改应收金额</el-button>
            </div>
			</cc-search>
			 <el-button class="main-search__btn" type='primary' v-role='{rt: $route, type: "add"}' @click='alert("add", {})'>
	          <i class="el-icon-plus"></i>新增
	        </el-button>
		</div>
		<p class="explain">当前查询结果任务数： <span class="dataStyle"> {{count}} </span>单，已填报<span class="dataStyle"> {{completeTotal}} </span>单，未填报<span class="dataStyle"> {{uncompleteTotal}} </span>单</p>
		<cc-table :data='dataList' :cols='cols' :total='total' :settings='settings'
			@size-change='sizeChange' @current-change='currentChange' @select-change='selectChange'>
			<template slot-scope='scope' slot='opt'>
				<el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
        		<el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>修改</el-button>
			</template>
		</cc-table>
		<el-dialog
		  :visible.sync="dialogVisible"
		  width="20%">
		  <span>确定批量修改应收金额为：</span>
		  <el-input v-model="inputVal" placeholder="请输入金额"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="edit3()">确 定</el-button>
		    <el-button @click="dialogVisible = false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		let ft = this.$root.$options.filters.dateFormat;
		var dDate = (new Date()).setDate((new Date()).getDate() - 1)
		return {
			search: {
				taskdate: [ft(dDate),ft(dDate)],
				startMoney: '',
				endMoney: '',
				startSpeelCost: '',
				endHighSpeed: '',
				startHamalCost: '',
				endHamalCost: '',
				curId: '',
				startSubsidyCost: '',
				endSubsidyCost: '',
				startArriveDate: '',
				endArriveDate: '',
				startParkingCost: '',
				endParkingCost: '',
				startPleaseCost: '',
				endPleaseCost: ''
			},
			searchSettings: {
				span: 6,
				labelWidth: '80px'
			},
			searchCols: [
				{
					label: '任务日期',
					prop: 'taskdate',
					daterange: true
				}, {
					label: '客户简称',
					prop: 'curId',
					base: 'CUSTOMER'
				}, {
					label: '搬运工姓名',
					prop: 'hamalName',
					input: true
				}, {
					label: '应收金额',
					slot: 'money'
				}, {
					label: '高速费',
					slot: 'SpeelCost',
				}, {
					label: '任务编号',
					prop: 'taskNo',
					input: true
				}, {
					label: '货运师',
					prop: 'contactsName',
					input: true
				}, {
					label: '车型',
					prop: 'modelId',
					dic: 'MODEL'
				}, {
					label: '搬运费',
					slot: 'HamalCost',
				}, {
					label: '夜间补贴',
					slot: 'SubsidyCost'
				}, {
					label: '到仓时间',
					slot: 'ArriveDate'
				}, {
					label: '车牌号',
					input: true,
					prop: 'plate'
				}, {
					label: '结算方式',
					dic: 'PAYTYPE',
					prop: 'isMode'
				},{
					label: '停车费',
					slot: 'ParkingCost'
				}, {
					label: '外请费用',
					slot: 'PleaseCost'
				}
			],
			dataList: [{}],
			cols: [
			    {
					label: '任务编号',
					prop: 'taskNo'
				}, {
					label: '任务日期',
					prop: 'taskDate',
				}, {
					label: '到仓时间',
					prop: 'arriveDate',
				}, {
					label: '货运师',
					prop: 'contactsName',
				}, {
					label: '客户简称',
					prop: 'curId',
					base: 'CUSTOMER'
				}, {
					label: '车型',
					prop: 'modelId',
					dic: 'MODEL'
				}, {
					label: '结算方式',
					prop: 'isMode',
					dic: 'PAYTYPE'
				},{
					label: '车牌号',
					prop: 'plate',
				}, {
					label: '应收金额',
					prop: 'money',
				}, {
					label: '件数',
					prop: 'cargoNumber',
				}, {
					label: '点数',
					prop: 'cargoPoint',
				}, {
					label: '充电费用',
					prop: 'cost',
				}, {
					label: '停车费',
					prop: 'parkingCost',
				}, {
					label: '高速费',
					prop: 'speelCost',
				}, {
					label: '夜间补贴',
					prop: 'subsidyCost',
				}, {
					label: '外请费用',
					prop: 'pleaseCost',
				}, {
					label: '搬运工费用',
					width: '100',
					prop: 'hamalCost',
				}, {
					label: '搬运工名称',
					width: '100',
					prop: 'hamalName',
				}, {
					label: '总里程',
					prop: 'mileage',
				}, {
					label: '订单里程',
					prop: 'orderMileage',
				}, {
					label: '返程里程',
					prop: 'jotMileage',
				}, {
					label: '高速费报销',
					prop: 'isSpeel',
					width: 100,
					select: true,
					format(val) {
						return val == '1' ? '已报销' : '未报销'
					}
				}, {
					label: '停车费报销',
					prop: 'isPaking',
					width: 100,
					select: 'isPaking',
					format(val) {
						return val == '1' ? '已报销' : '未报销'
					}
				},{
					label: '操作',
					width: 100,
					slot: 'opt'
				}
			],
			 settings: { 
			  select: 'checkbox',
	        },
			isExpand: false,
			onQuery: false,
			query: {
				rows: this.__rows,
				page: 1
			},
			total: 0,
			onExport: false,
			dialogVisible: false,
			inputVal: '',
			count: '',
			completeTotal: '',
			uncompleteTotal: '',
			symbol: [],
			onGSF: false,
			onTCF: false,
			onMONEY: false
		}
	},
	methods: {
		alert(todo, row) {
			let title = '新增日营运数据填报';
			if('edit' == todo) {
				title = '编辑日营运数据填报'
			} else if ('view' == todo) {
				title = '查看日营运数据填报'
			}
			new Promise(resolve => {
				this.$emit('openAlert', {
					title: title,
					width: '1200px',
					height: '850px',
					url: '/diaodu/temp/dailytask_det.vue',
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
		edit(val) {
			if(this.symbol != 0) {
				let title = ''
				if(val == 'GSF') {
					title = '确定批量修改高速费报销状态'
				} else if(val == 'TCF') {
					title = '批量修改停车费报销状态'
				} else if(val == 'MONEY') {
					this.dialogVisible = true
					return
				}
				this.__confirm(this, title, title, {}).then(res => {
					if(val == 'GSF') {
		          		this.edit1()
					} else if(val == 'TCF') {
						this.edit2()
					}
		        }).catch(err => {
		          console.log(err)
		        }) 
		    }else {
				console.log('请先选中要更改的内容')
			}
			
		},
		edit1() {
			this.onGSF = true
			this.axios.post('/dispatch/editSpeelStatus', this.symbol).then(res => {
				this.getData()
				this.onGSF = false
			}).catch(err => {
				this.onSubmit = false;
			})
		},
		edit2() {
			this.onTCF = true
			this.axios.post('/dispatch/editParkingStatus', this.symbol).then(res => {
				this.getData()
				this.onTCF = false
			}).catch(err => {
				this.onSubmit = false;
			})
		},
		edit3() {
			this.onMONEY = true
			if (this.symbol != 0) {
				this.dialogVisible = false;
				this.axios.post('/dispatch/editMoney', {
					ids: this.symbol,
					money: this.inputVal
				}).then(res => {
					this.getData()
					this.onMONEY = false
				}).catch(err => {
					this.onSubmit = false;
				})
			}else {
				console.log('请先选中要更改的内容')
			}
		},
		getData() {
			 this.onQuery = true;
			 this.completeTotal = 0;
			 this.uncompleteTotal = 0
			  let dateData = {
		          startTaskDate: this.search.taskdate[0],
		          endTaskDate: this.search.taskdate[1]
		        }
	          let data =Object.assign({}, this.search, this.query, dateData);
	          this.axios.post('/dispatch/queryOperateDateByPage', data).then(res => {
	            this.onQuery = false;
	            if(200 == res.code) {
	              this.dataList = res.data || [];
	              this.total = res.count;
	            }
	          }).catch(err => {
	            this.onQuery = false
	          })
	          this.axios.post('/dispatch/queryReport',dateData).then(res => {
	          		this.count =  res.data.taskCount;
	          		this.completeTotal = res.data.reportedCount;
	          		this.uncompleteTotal = res.data.noReportCount;
	          	})
	      },
	      reset() {
	      	this.__reset(this.search)
	      },
		sizeChange(pageSize) {
			this.query.rows = pageSize;
			this.getData();
		},
		currentChange(page) {
			this.query.page = page;
			this.getData();
		},
		exportData() {
			this.onExport = true;
		},
		selectChange(obj) {	
			this.symbol = []
			for(let i=0; i<obj.length; i++) {
				this.symbol.push(obj[i].id)
			}	
		}
	},
	mounted() {
		this.getData();
	}
}
</script>
<style lang="stylus" scoped>
.el-input.min 
	width: 48px !important
.upload-demo
	display: inline-block
	margin-left: 10px
.explain
	font-size: 14px !important
	padding-left: 30px
.dataStyle
	font-size: 20px !important
	color: red
.main-search__body .item 
	margin-right: 60px !important
</style>
