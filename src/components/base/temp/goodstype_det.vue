<!-- 点部管理 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
		</cc-form>
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
			return {
				data: {
					id: '',
					remark: '',
					typename: '',
				},
				baseCols: [
					[
						{
							label: '类型名称',
							prop: 'typename',
							input: true
						}, {
							label: '备注',
							prop: 'remark',
							textarea: true
						}
					]
				],
				baseRules: {
					typename: this.__Valid.init(['null']),
					// partName: this.__Valid.init(['null']),
					// orgId: this.__Valid.init(['null']),
					// area: this.__Valid.init(['null']),
					// address: this.__Valid.init(['null']),
				},
				formSet: {
					// span: 24
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
						url = '/GoodsTypeController/GoodsTypeinsertGoods'
					}
					if('edit' == this.params.todo) {
						url = '/GoodsTypeController/GoodsTypeupdateGoods'
					}
					this.onSave = true;
					this.axios.post(url, this.data).then(res => {
						this.onSave = false;
						if(200 == res.code) {
							this.$message.success(res.msg || '操作成功.');
							this.$emit('close');
							this.$emit('updateCache', {
								type: 'goodstype'
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