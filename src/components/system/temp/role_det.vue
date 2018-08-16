<!-- 角色详情 -->
<template>
	<div class='alert-body__component'>
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-tree
				:data="menuList"
				node-key="id"
				:show-checkbox='showCheckbox' 
				:default-expand-all='true' 
				:props='{children: "list"}'
				:default-checked-keys='checkedMenu'
				@check-change="handleCheckChange"
				:expand-on-click-node="false" slot='setMenu'>
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<span class='col1' v-if='data.list'>{{ data.title }}</span>
					<span class='col1' v-else>{{ data.title }} # {{data.href}}</span>
				</div>
			</el-tree>
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
		return {
			data: {
				id: '',
				roleName: '',
				roleDesc: '',
				createrPerson: '',
				createTime: '',
				upPerson: '',
				uDate: '',
			},
			baseCols: [
				[
					{
						label: '角色名:',
						prop: 'roleName',
						input: true
					}, {
						label: '角色描述:',
						input: true,
						prop: 'roleDesc'
					}, {
						label: '创建人:',
						prop: 'createrPerson'
					}, {
						label: '创建时间:',
						prop: 'createTime',
						filter: 'dateFormat'
					}, {
						label: '修改人:',
						prop: 'upPerson'
					}, {
						label: '修改时间:',
						prop: 'uDate',
						filter: 'dateFormat'
					},
				], [
					{
						label: '角色授权',
						slot: 'setMenu'
					}
				]
			],
			baseRules: {
				roleName: this.__Valid.init(['null']),
			},
			formSet: {
				span: 12
			},
			onSubmit: false,
			menuList: [],
            checkedMenu: [],
			showCheckbox: true
		}
	},
	methods: {
		submit() {
			new Promise((resolve) => {
				this.$refs.form.validate(resolve)
			}).then(s => {
				this.onSubmit = true;
				let data = JSON.parse(JSON.stringify(this.data))
				delete data.createrPerson;
				delete data.createTime;
				delete data.upPerson;
				delete data.uDate;
				data.ids = this.checkedMenu;
				this.axios.post('/user/role/saveOrUpdate', data).then(res => {
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
		},
		handleCheckChange(data, checked, indeterminate) {
			if(checked) {
				this.checkedMenu.push(data.id)
			} else {
				let i = this.checkedMenu.length;
				while(i--) {
					if(data.id == this.checkedMenu[i]) {
						this.checkedMenu.splice(i, 1)
					}
				}
			}
		}
	},
	mounted() {
		this.checkedMenu = this.params.row.ids || [];
		if('view' == this.params.todo) {
			this.__alertView(this.baseCols);
			this.baseRules = {};
			this.showCheckbox = false;
			this.menuList = this.__menuTree(this.checkedMenu);
		} else {
			this.menuList = this.__menuTree();
		}
		if('add' != this.params.todo) {
			this.__setValue(this.data, this.params.row);
		}
	}
}
</script>
