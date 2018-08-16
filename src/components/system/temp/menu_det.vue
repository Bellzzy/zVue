<!-- 菜单详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-input type='password' v-model='data.passWord' slot='passWord'></el-input>
			<!-- <el-input v-model='data.code' slot='code' ></el-input> -->
			 <el-autocomplete class="inline-input" v-model="data.code" placeholder="请输入内容" slot='code' 
			 	:fetch-suggestions="querySearch" @select="handleSelect"
			 	v-if='"1" == data.type && "view" != params.todo'></el-autocomplete>
			<span slot='code' v-if='"view" == params.todo'>{{data.code}}</span>
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
				parentId: '',
				title: '',
				href: '',
				type: '0',
				icon: '',
				description: '',
				orderNum: '0',
				code: ''
			},
			baseCols: [
				[
					{
						label: '上级菜单',
						prop: 'parentId',
						format(val) {
							return self.params.row.parentTitle
						}
					}, {
						label: '菜单名称',
						prop: 'title',
						input: true
					}, {
						label: '页面/接口地址',
						input: true,
						prop: 'href'
					}, {
						label: '菜单类型',
						radio: true,
						prop: 'type',
						list: [
							{
								name: '菜单',
								value: '0'
							}, {
								name: '按钮',
								value: '1'
							}
						]
					}, {
						label: 'Code',
						slot: 'code'
					}, {
						label: '权重',
						input: true,
						prop: 'orderNum'
					}, {
						label: '图标',
						input: true,
						prop: 'icon'
					}, {
						label: '描述',
						input: true,
						prop: 'description'
					}
				]
			],
			baseRules: {
				title: this.__Valid.init(['null']),
				// href: this.__Valid.init(['null']),
			},
			codeList: [
				{
					code: 'add',
					value: '新增/add'
				}, {
					code: 'view',
					value: '查看/view'
				}, {
					code: 'edit',
					value: '编辑/edit'
				}, {
					code: 'delete',
					value: '删除/delete'
				}
			],
			formSet: {
				span: 24,
				labelWidth: '100px'
			},
			onSubmit: false
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				this.onSubmit = true;
				let data = JSON.parse(JSON.stringify(this.data));
				let dataUrl = '/user/menuController/addMenu';
				if(data.id) {
					dataUrl = '/user/menuController/editMenu'
				}
				this.axios.post(dataUrl, data).then(res => {
					this.onSubmit = false;
					if(200 == res.code) {
						this.$message.success(res.msg)
						this.$emit('close');
						this.$emit('updateCache', {
							type: 'menu'
						});
						this.params.callback && this.params.callback();
					}
				}).catch(err => {
					this.onSubmit = false;
				})
			})
		},
		querySearch(qs, cb) {
			// var restaurants = this.codeList;
	  //       var results = qs ? restaurants.filter(this.createFilter(qs)) : restaurants;
	        // 调用 callback 返回建议列表的数据
	        cb(this.codeList);
		},
		handleSelect(item) {
			this.data.code = item.code;
			this.data.title = item.value.replace('/' + item.code, '')
		}
	},
	mounted() {
		if('view' == this.params.todo) {
			this.__alertView(this.baseCols);
			this.baseRules = {};
		}
		if('add' != this.params.todo) {
			this.__setValue(this.data, this.params.row);
		}
		this.data.parentId = this.params.row.parentId;
		if('add' == this.params.todo) {
			let row = this.params.row;
			if(-1 != row.pid) {
				this.data.href = row.href;
				this.data.type = '1';
				this.baseCols[0][2].input = false;
				this.baseCols[0][3].disabled = true;
			}
		}
	}
}
</script>
<style lang="stylus">
</style>

