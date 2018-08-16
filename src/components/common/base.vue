<!-- 基础数据下拉列表 -->
<template>
	<span v-if='disabled'>{{getName(model)}}</span>
	<el-select v-else v-model='model' @change='change' filterable>
		<slot name='option'></slot>
		<el-option v-for='item,index in list' :key='index' :value='getLabel ? (item.name+"") : (item.id+"")' :label='item.name'></el-option>
	</el-select>
</template>
<script>
export default {
	name: 'cc-base',
	/*
	type：获取字典类型的code，大写
	value: 绑定的值
	getLabel: 为true是取label值，为false和默认时取id值
	 */
	props: ['type', 'value', 'getLabel', 'disabled'],
	data() {
		return {
			model: '',
			data: {
				// 组织机构 
				COMPANY: '',
				// 客户信息
				CUSTOMER: '',
				// 司机
				DRIVER: '',
				// 外请搬运工
				OUTSIDE: '',
				// 项目负责人
				PM: '',
			}
		}
	},
	methods: {
		change(val) {
			this.$emit('input', this.model)
			this.$emit('change', this.list.find(item => this.model == item.id) || {})
		},
		getName(val) {
			let obj = this.list.find(item => item.id == val) || {};
			return obj.name || val;
		}
	},
	mounted() {
		this.model = (this.value||'') + '';
		let data =sessionStorage.getItem('BASEDATA');
		data = data ? JSON.parse(data) : {};
		this.data = data;
	},
	watch: {
		value(n, o) {
			this.model = (n||'') + '';
		}
	},
	computed: {
		list() {
			return this.data[this.type] || [];
		}
	}
}
</script>
