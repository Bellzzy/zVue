<template>
	<span v-if='disabled'>{{getName(radio)}}</span>
	<el-radio-group v-else v-model="radio" @change='change'>
		<el-radio v-for='(item,index) in listSet' :label='(item.value + "")' :key='index'>{{item.name}}</el-radio>
	</el-radio-group>
</template>
<script>
export default {
	name: 'cc-radio',
	props: ['value', 'list', 'disabled'],
	data() {
		return {
			radio: ''
		}
	},
	methods: {
		getName(val) {
			let obj = this.listSet.find(item => item.value === val) || {};
			return obj.name || val;
		},
		change(val) {
			this.$emit('change', val)
		}
	},
	mounted() {
		if(undefined != this.value && null != this.value) {
			this.radio = this.value + '';
		}
	},
	watch: {
		value(n) {
			if(undefined != n && null != this.value) {
				this.radio = n + '';
			}
		},
		radio(n) {
			this.$emit('input', n)
		}
	},
	computed: {
		listSet() {
			return this.list || [
				{
					value: '1',
					name: '是'
				}, {
					value: '0',
					name: '否'
				}
			]
		}
	}
}
</script>
