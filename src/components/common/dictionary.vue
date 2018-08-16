<!-- 字典下拉列表 -->
<template>
	<span v-if='disabled'>{{getName(model)}}</span>
	<el-select v-else v-model='model' @change='change' filterable>
		<slot name='option'></slot>
		<el-option v-for='item,index in list' :key='index' :value='getLabel ? (item.dicValue+"") : (item.id+"")' :label='item.dicValue'></el-option>
	</el-select>
</template>
<script>
export default {
	name: 'cc-dic',
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
				// 结算方式 
				PAYTYPE: '',
				// 是否
				YESORNO: '',
				// 驾驶证类型
				DRIVERTYPE: '',
				// 岗位类别
				JOBCATEGORY: ''
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
			return obj.dicValue || val;
		}
	},
	mounted() {
		this.model = (this.value||'') + '';
		let dicData = sessionStorage.getItem('DICDATA');
		if(dicData) {
			dicData = JSON.parse(dicData);
		} else {
			dicData = [];
		}
		let data = dicData,
			i = data.length,
			obj = {};
		while(i--) {
			obj[data[i].dicCode.toUpperCase()] = data[i].list || [];
		}
		this.data = obj;
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
