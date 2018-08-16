<!-- 菜单管理 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">菜单管理</div>
			<div class='main-search__body'>&nbsp;</div>
			<el-button class="main-search__btn" type='primary' @click='alert("add", "", -1)' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<div class="main-body">
			<div class="custom-tree-node title">
				<span class='col1'>菜单名称</span>
				<ul class='col2' style='width: 800px'>
					<li class='item' style='width: 300px'>页面/接口地址</li>
					<li class='item' style='width: 100px'>菜单类型</li>
					<li class='item' style='width: 50px'>Code</li>
					<li class='item' style='width: 50px'>权重</li>
					<li class='item' style='width: 300px'>操作</li>
				</ul>
			</div>
			<el-tree
				:data="data"
				node-key="id"
				:default-expand-all='false' 
				:props='{children: "list"}'
				:expand-on-click-node="true">
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<span class='col1' v-if='data.list'>{{ data.title }}</span>
					<span class='col1' v-else>{{ data.title }}</span>
					<ul class='col2' style='width: 800px'>
						<li class='item item-max' style='width: 300px'>{{ data.href }}</li>
						<li class='item item-min' style='width: 100px'>{{ 0 == data.type ? '菜单' : '按钮' }}</li>
						<li class='item item-min' style='width: 50px'>{{ data.code }}</li>
						<li class='item item-min' style='width: 50px'>{{ data.orderNum }}</li>
						<li class='item' style='width: 300px'>
							<el-button v-if='0 == data.type' type='text' @click='alert("add", data, data.parentId)' v-role='{rt: $route, type: "add"}'>{{
								-1 == data.parentId ? '新增子菜单' : '新增子菜单'
							}}</el-button>
							<el-button type='text' @click='alert("edit", data)' v-role='{rt: $route, type: "edit"}'>编辑</el-button>
							<el-button type='text' @click='alert("view", data)' v-role='{rt: $route, type: "view"}'>查看</el-button>
							<el-button type='text' @click='delMenu(data)' v-role='{rt: $route, type: "delete"}'>删除</el-button>
						</li>
					</ul>
				</div>
			</el-tree>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			test: '',
			search: {
				words: ''
			},
			searchCols: [
				{
					label: '字典/类型名称:',
					prop: 'words'
				}
			],
			data: [],
			col2_width: '',
			onQuery: false
		}
	},
	methods: {
		alert(todo, row, pid) {
			if(row) {
				row = JSON.parse(JSON.stringify(row))
			} else {
				row = {
					parentId: -1
				}
			}
			if('add' == todo) {
				row.pid = row.parentId;
				row.parentId = row.id || -1;
				delete row.id;
			}
			if(-1 == row.parentId) {
				row.parentTitle = '顶级菜单'
			} else {
				row.parentTitle = this.getTitle(row.parentId)
			}
			let title = '新增菜单';
			if('edit' == todo) {
				title = '编辑菜单'
			} else if ('view' == todo) {
				title = '查看菜单'
			}
			let self = this;
			this.$emit('openAlert', {
				title: title,
				width: '600px',
				height: '450px',
				url: '/system/temp/menu_det.vue',
				props: {
					row: row,
					todo: todo,
					callback() {
						self.getData()
					}
				}
			})
		},
		getData() {
			this.data = this.__menuTree();
		},
		// 根据ID获取菜单名称
		getTitle(id) {
			let list = sessionStorage.getItem('allMenuList');
			list = list ? JSON.parse(list) : [];
			let i = list.length;
			while(i--) {
				if(id == list[i].id) {
					return list[i].title;
				}
			}
		},
		delMenu(row) {
			// TODO获取当前节点的子节点ID
			let ids = this.getChildrenId(row) || [];
			this.axios.post('/user/menuController/deleteMenu', ids).then(res => {
				if(200 == res.code) {
					this.$message.success(res.msg)
					this.$emit('updateCache', {
						type: 'menu'
					});
				}
			})
		},
		// 获取当前菜单及子菜单的ID
		getChildrenId(obj) {
			let arr = [obj.id],
				loop = function(list) {
					let j = list.length, arrs = [];
					while(j--) {
						arrs.push(list[j].id)
						let temp
						if(list[j].list) {
							temp = loop(list[j].list)
						}
						if(temp) {
							arrs = arrs.concat(temp)
						}
					}
					return arrs;
				};
			if(obj.list) {
				arr = arr.concat(loop(obj.list) || [])
			}
			return arr;
		}
	},
	mounted() {
		this.col2_width = (this.$el.clientWidth * 0.8) + 'px';
		// this.getData();
		this.$root.events.$on('updateMenu', this.getData)
	},
	beforeDestroy() {
		this.$root.events.$off('updateMenu')
	}
}
</script>
<style lang="stylus" scoped>
.custom-tree-node
	width: 100%
	display: -ms-flexbox
	display: flex
	-ms-flex-align: center
	align-items: center
	-ms-flex-pack: justify
	justify-content: space-between
	font-size: 14px
	.col2 
		font-size: 0 !important
		.item
			display: inline-block
			text-align: right
			padding: 0 5px
			box-sizing: border-box
	&.title
		background-color: #f2f2f2
		height: 30px
		line-height: 30px
		.col1 
			padding-left: 5px
.el-tree>.el-tree-node:nth-child(2n) 
	background-color: #f5f5f5
.el-tree
	overflow: auto
	max-height: 100%
</style>
