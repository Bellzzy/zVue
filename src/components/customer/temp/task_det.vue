<!-- 任务详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			 <template slot='taskDate'>
	             <el-date-picker v-model="data.taskTime" :picker-options="pickerBeginDateBefore" type="date" format='yyyy-MM-dd' value-format='yyyy-MM-dd' placeholder="选择日期" ></el-date-picker>
	          </template>
			<el-form-item label='备注' slot='row'>
				<span v-if='"view" == params.todo'>{{data.remark}}</span>
				<el-input v-else type='textarea' :rows='5' v-model='data.remark'></el-input>
			</el-form-item>
		</cc-form>
		<div class='opt'>
			<el-button v-if='"view" != params.todo' type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit'>提交</el-button>
			<el-button type='danger' @click="$emit('close')">关闭</el-button>
		</div>
	</div>
</template>
<script>
export default {
	props: ['params'],
	data() {
		let self = this;
		return {
			data: {
				id: '',
				cusId: '',
				taskTime: '',
				taskNo: '',
				arriveDate: '',
				modelId: '',
				partId: '',
				address: '',
				dirverName: '',
				dirverPhone: '',
				startRegion: '',
				endRegion: '',
				contactsName: '',
				phone: '',
				cargoType: '',
				ygMileage: '',
				remark: '',
			},
			
			baseCols: [
				[
					{
						label: '客户名称',
						prop: 'cusId',
						base: 'CUSTOMER'
					}, {
						label: '任务日期',
						slot: 'taskDate'
					}, {
						label: '到仓时间',
						input: true,
						prop: 'arriveDate'
					}, {
						label: '所需车型',
						dic: 'MODEL',
						prop: 'modelId'
					}, {
						label: '取货地点',
						base: 'POINT',
						prop: 'partId',
						change(obj) {
							if(obj) {
								self.data.address = obj.address;
							}
						}
					}, {
						label: '取货地址',
						input: true,
						prop: 'address'
					}
				], [
					{
						label: '起始区域',
						base: 'REGIONS',
						prop: 'startRegion'
					}, {
						label: '送达区域',
						base: 'REGIONS',
						prop: 'endRegion'
					}, {
						label: '联系人',
						input: true,
						prop: 'contactsName'
					}, {
						label: '联系方式',
						input: true,
						prop: 'phone'
					}, {
						label: '货物类型',
						base: 'GOODSTYPE',
						prop: 'cargoType'
					}, {
						label: '预估里程',
						input: true,
						prop: 'ygMileage',
					}
				]
			],
			baseRules: {
				taskTime: this.__Valid.init(['null']),
				arriveDate: this.__Valid.init(['hours', 'null']),
				modelId: this.__Valid.init(['null']),
				startRegion: this.__Valid.init(['null']),
				endRegion: this.__Valid.init(['null']),
				contactsName: this.__Valid.init(['null']),
				phone: this.__Valid.init(['phone', 'null']),
				cargoType: this.__Valid.init(['null']),
			},
			formSet: {
				span: 12
			},
			onSubmit: false,
			pickerBeginDateBefore: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				}
			},
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				this.onSubmit = true;
				let data = JSON.parse(JSON.stringify(this.data)),
					url = '/tms/task/saveTask';
				if('edit' == this.params.todo) {
					url = '/tms/task/upTask';
				}
				this.axios.post(url, data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg)
						this.$emit('close');
						this.params.callback && this.params.callback();
					}
				}).catch(err => {
					this.onSubmit = false;
				})
			})
		}
	},
	mounted() {
		if('view' == this.params.todo) {
			this.__alertView(this.baseCols);
			this.baseRules = {};
		}
		if('add' != this.params.todo) {
			this.__setValue(this.data, this.params.row);
			this.data.taskTime = this.$root.$options.filters.dateFormat(this.data.taskTime);
		}
	}
}
</script>
