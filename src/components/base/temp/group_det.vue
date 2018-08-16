<!-- 新增基本信息详情 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'></cc-form>
		<div class="opt">
			<el-button type='success' @click='save' :loading='onSave' :disabled='onSave' v-if='"view" != params.todo'>保存</el-button>
			<el-button type='danger' @click='$emit("close")'>关闭</el-button>
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
					orgShortName: '',
					orgFullName: '',
					orgCode: '',
					orgAddress: '',
					orgLeader: '',
					orgPhone: '',
					orgEmail: '',
					cityId: ''
				},
				baseCols: [
					[
						{
				            label: '机构全称',
				            input: true,
				            prop: 'orgFullName'
			          	}, {
				            label: '机构简称',
				            input: true,
				            prop: 'orgShortName'
			          	}, {
				            label: '机构代码',
				            input: true,
				            prop: 'orgCode'
			          	}, {
				            label: '机构地址',
				            input: true,
				            prop: 'orgAddress'
				        }
					], [
						{
				            label: '机构负责人',
				            input: true,
				            prop: 'orgLeader'
			          	}, {
				            label: '负责人电话',
				            input: true,
				            prop: 'orgPhone'
			          	}, {
				            label: '邮箱地址',
				            input: true,
				            prop: 'orgEmail'
			          	}, {
				            label: '所在城市',
				            base: 'CITY',
				            prop: 'cityId'
				        }
					]
				],
				baseRules: {
					orgShortName: this.__Valid.init(['null']),
					orgFullName: this.__Valid.init(['null']),
					orgCode: this.__Valid.init(['null']),
					orgAddress: this.__Valid.init(['null']),
					orgLeader: this.__Valid.init(['null']),
					orgPhone: this.__Valid.init(['phone', 'null']),
					cityId: this.__Valid.init(['null'])
				},
				formSet: {
					labelWidth: '100px'
				},
				onSave: false
			}
		},
		methods: {
			save() {
				new Promise((resolve) => {
					this.$refs.form.validate(resolve)
				}).then(s => {
					let url;
					if('add' == this.params.todo) {
						url = '/tmsOrgInfo/add'
					}
					if('edit' == this.params.todo) {
						url = '/tmsOrgInfo/update'
					}
					this.onSave = true;
					this.axios.post(url, this.data).then(res => {
						this.onSave = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.')
							this.$emit('close');
							this.$emit('updateCache', {
								type: 'group'
							});
							this.params.callback && this.params.callback();
						}
					}).catch(err => {
						this.onSave = false;
					})
				})
			}
		},
		mounted() {
			if('add' != this.params.todo) {
				this.__setValue(this.data, this.params.row);
			}
			if('view' == this.params.todo) {
				this.__alertView(this.baseCols);
				this.baseRules = {}
			}
		}
	}
</script>