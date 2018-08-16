<!-- 调度记录详情 -->
<template>
	<div class='alert-body__component'>
		<div>
			<h1>任务信息</h1>
			<table class='task'>
				<tr>
					<td>任务单号</td>
					<td>{{data.taskNo}}</td>
					<td>到仓时间</td>
					<td>{{data.arriveDate}}</td>
					<td>操作人</td>
					<td>{{data.crtPerson}}</td>
				</tr>
				<tr>
					<td>客户简称</td>
					<td>{{__getBaseData('CUSTOMER', data.cusId)}}</td>
					<td>预估里程(km)</td>
					<td>{{data.ygMileage}}</td>
					<td>任务操作时间</td>
					<td>{{data.crtDate}}</td>
				</tr>
				<tr>
					<td>任务日期</td>
					<td>{{data.taskNo}}</td>
					<td>货物类型</td>
					<td>{{__getBaseData('GOODSTYPE', data.cargoType)}}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>所需车型</td>
					<td>{{__getDicValue('MODEL', data.modelId)}}</td>
					<td>联系人</td>
					<td>{{data.contactsName}}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>取货仓库</td>
					<td>{{data.address}}</td>
					<td>联系电话</td>
					<td>{{data.phone}}</td>
					<td></td>
					<td></td>
				</tr>
			</table>
			<h1>调度信息</h1>
			<table class='other'>
				<tr>
					<th>工单号</th>
					<th>客户所属分公司</th>
					<th>驾驶员</th>
					<th>驾驶员电话</th>
					<th>调度操作人</th>
					<th>调度时间</th>
				</tr>
				<tr>
					<td>{{data.workNo}}</td>
					<td>{{getCompany(data.cusId)}}</td>
					<td>{{data.driver}}</td>
					<td>{{data.driverPhone}}</td>
					<td>{{data.schPerson}}</td>
					<td>{{data.schDate}}</td>
				</tr>
			</table>
			<h1>任务执行时间信息</h1>
			<table class='other'>
				<tr>
					<th>APP确认时间</th>
					<th>到达仓库时间</th>
					<th>开始配送时间</th>
					<th>配送完成/异常完成时间</th>
					<th>影像上传时间</th>
				</th>
				<tr>
					<td>{{data.appDate}}</td>
					<td>{{data.arriveTime}}</td>
					<td>{{data.startDate}}</td>
					<td>{{data.errorDate}}</td>
					<td>{{data.appImageDate}}</td>
				</tr>
			</table>
		</div>
		<div class='opt'>
			<el-button type='primary' @click="dialogFormVisible = true">查看运单影像</el-button>
			<el-button type='danger' @click="$emit('close')">返回</el-button>
		</div>
		<div class='alert' v-if='dialogFormVisible'>
			<div class='alert-body' style="width:1110px; height: 571px">
				<div class='alert-body__title'>
					<strong>运单影像查阅</strong>
					<div class='close' @click='dialogFormVisible = false'>
						<i class='el-icon-close'></i>
					</div>
				</div>
				<div class="box">
					<div v-for='item, index in list' class='list' :key='index'>
						<img :src='item' v-view :url='item'/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['params'],
	data() {
		return {
			data: {
				crtDate: '',
				ygMileage: '',
				crtPerson: '',
				schPerson: '',
				schDate: '',
				appDate: '',
				arriveTime: '',
				startDate: '',
				errorDate: '',
				address: "",
				arriveDate: '',
				cargoType: '',
				contactsName: "",
				cusId: "",
				driver: null,
				driverPhone: null,
				id: '',
				modelId: '',
				orgId: null,
				partId: null,
				phone: "",
				plate: null,
				state: null,
				taskNo: "",
				taskState: '',
				taskTime: "",
				type: null,
				workNo: null,
				appImageDate: '',
				appImageUrl: ''
			},
			dialogFormVisible: false,
			list: []
		}
	},
	methods: {
		getCompany(val) {
			let orgId,
				list = this.__getBaseData('CUSTOMER'),
				i = list.length;
			while(i--) {
				if(val == list[i].id) {
					if(list[i].orgid) {
						return this.__getBaseData('COMPANY', list[i].orgid);
					}
				}
			}
			return ''
		},
		view() {
			this.dialogFormVisible = true;
		}
	},
	mounted() {
		let urls = this.params.row.appImageUrl
		this.list = urls ? urls.split(',') : [];
		this.__setValue(this.data, this.params.row)
	}
}
</script>
<style lang="stylus" scoped>
.box
	padding: 10px 0 10px 10px
	height: 540px
	overflow: auto
.list
	display: inline-block
	width: 350px
	height: 250px
	margin-right: 10px
	margin-bottom: 10px
	vertical-align: top
	img
		max-width: 100%
		max-height: 100%
h1 
	font-size: 16px !important
	font-weight: bold
	height: 40px
	line-height: 40px
.task
	border-width: 1px
	border-color: #ccc
	border-collapse: collapse
	margin-bottom: 10px
	tr
		border-width: 1px
		height: 30px
		line-height: 30px
		border-style: solid
		border-color: #ccc
		background-color: #dedede
		td
			border-width: 1px
			border-style: solid
			border-color: #ccc
			background-color: #ffffff
			text-align: center
			width: 150px
		td:nth-child(2n-1)
			background-color: #f2f2f2
.other
	border-width: 1px
	border-color: #ccc
	border-collapse: collapse
	margin-bottom: 10px
	tr
		border-width: 1px
		height: 30px
		line-height: 30px
		border-style: solid
		border-color: #ccc
		th, td
			border-width: 1px
			border-style: solid
			border-color: #ccc
			text-align: center
			width: 150px
		th
			background-color: #f2f2f2
		td
			background-color: #fff
</style>
