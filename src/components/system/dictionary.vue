<!-- 字典管理 -->
<template>
	<div class='main'>
		<div class="main-search" v-split>
			<div class="main-search__title">字典管理</div>
			<div class="main-search__body"></div>
			<el-button class="main-search__btn" type='primary' @click='addDictionary("add", {})' v-role='{rt: $route, type: "add"}'>
				<i class="el-icon-plus"></i>新增
			</el-button>
		</div>
		<div class="main-body">
			<div class="custom-tree-node title">
				<span class='col1'>字典(类型)名称&nbsp;/&nbsp;Code</span>
				<ul class='col2'>
					<li class='item'>创建人</li>
					<li class='item'>创建时间</li>
					<li class='item'>修改人</li>
					<li class='item'>修改时间</li>
					<li class='item2'>操作</li>
				</ul>
			</div>
			<el-tree
				:data="data"
				node-key="id"
				:props='{children: "list"}'
				:expand-on-click-node="false">
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<span class='col1' v-if='data.list'>{{ data.dicValue}}&nbsp;/&nbsp;{{ data.dicCode}}</span>
					<span class='col1' v-else>{{ data.dicValue }}</span>
					<ul class='col2'>
						<li class='item'>{{ data.crtPerson }}</li>
						<li class='item'>{{ data.crtDate }}</li>
						<li class='item'>{{ data.upPerson }}</li>
						<li class='item'>{{ data.upDate }}</li>
						<li class='item2'>
							<el-button type='text' @click='alert("edit", data)' v-role='{rt: $route, type: "edit"}'>编辑</el-button>
							<el-button type='text' @click='alert("view", data)' v-role='{rt: $route, type: "view"}'>查看</el-button>
							<!-- <el-button type='primary' @click='delRow(data)' v-role='{rt: $route, type: "delete"}'>删除</el-button> -->
							<el-button v-if='data.list' type='text' @click='addCategory("add", data)' v-role='{rt: $route, type: "add"}'>新增子类型</el-button>
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
			onQuery: false
		}
	},
	methods: {
		addDictionary(todo, row) {
			let title = '新增字典';
			if('edit' == todo) {
				title = '编辑字典'
			} else if ('view' == todo) {
				title = '查看字典'
			}
			let self = this;
			this.$emit('openAlert', {
				title: title,
				width: '800px',
				height: '400px',
				url: '/system/temp/add_dictionary.vue',
				props: {
					row: row,
					todo: todo
				}
			})
		},
		addCategory(todo, row) {
			let title = '新增类型';
			if('edit' == todo) {
				title = '编辑类型'
			} else if ('view' == todo) {
				title = '查看类型'
			}
			let self = this;
			this.$emit('openAlert', {
				title: title,
				width: '800px',
				height: '400px',
				url: '/system/temp/add_category.vue',
				props: {
					row: row,
					todo: todo
				}
			})
		},
		alert(todo, row) {
			if(row.list) {
				this.addDictionary(todo, row)
			} else {
				this.addCategory(todo, row)
			}
		},
		getData() {
			let data = sessionStorage.getItem('DICDATA');
			this.data = data ? JSON.parse(data) : [];
		},
		delRow(row) {
	        this.__confirm(this).then(res => {
	        	// 删除子表
	        	let url ='/dictionary/deleteDictionaryDetail'
	        	if(row.list) {
	        		// 删除主表
	        		url ='/dictionary/deleteDictionary'
	        	}
	          	this.axios.post(url, [row.id]).then(res => {
		            if(200 == res.code) {
		              	this.$message.success(res.msg);
						this.$emit('updateCache', {
							type: 'dic'
						});
		            }
	          	})
	        }).catch(err => {})
		}
	},
	mounted() {
		this.getData();
		this.$root.events.$on('updateDic', this.getData)
	},
	beforeDestroy() {
		this.$root.events.$off('updateDic')
	}
}
</script>
<style lang="stylus">
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
		width: 850px
		font-size: 0 !important
		.item
			display: inline-block
			width: 150px
		.item2
			display: inline-block
			width: 250px
	&.title
		background-color: #f2f2f2
		height: 30px
		line-height: 30px
		.col1 
			padding-left: 5px
.el-tree>.el-tree-node:nth-child(2n) 
	background-color: #f5f5f5
</style>
