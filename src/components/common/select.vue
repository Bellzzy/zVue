<template>
	<span v-if='disabled'>{{getName(model)}}</span>
	<el-select v-else v-model='model' placeholder='请选择' @change='change'>
		<slot name='option'></slot>
		<el-option
			v-for='item in options'
			:key='item.value'
			:label='item.label'
			:value='item.value'
		></el-option>
	</el-select>
</template>
<script>
export default {
	name: 'cc-select',
	props: ['options', 'value', 'disabled'],
	data() {
		return {
	        model: ''
		}
	},
	methods: {
		getName(val) {
			let obj = this.options.find(item => item.value === val) || {};
			return obj.label || val;
		},
		change(obj) {
			this.$emit('input', this.model)
		}
	},
	mounted() {
		this.model = this.value;
	},
	watch: {
		value(n) {
			this.model = n;
		}
	}
}
</script>