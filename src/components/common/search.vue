<template>
	<div class="main-search__body">
		<div class='item' v-for='(item,index) in cols' :key='index' :class="{'daterange': item.daterange}">
			<label>{{item.label}}</label>
			<el-date-picker v-model="data[item.prop]" :value-format='item.format||"yyyy-MM-dd"' type="date" :editable='false' 
				placeholder="选择日期" v-if='item.date'></el-date-picker>
			<el-date-picker v-model="data[item.prop]" type="daterange" :editable='false' :value-format='item.format||"yyyy-MM-dd"'
				start-placeholder="开始日期" end-placeholder="结束日期" range-separator="-" v-else-if='item.daterange'></el-date-picker>
			<cc-dic :type='item.dic' v-model='data[item.prop]' v-else-if='item.dic'>
				<el-option slot='option' value='' label='请选择'></el-option>
			</cc-dic>
			<cc-base :type='item.base' v-model='data[item.prop]' v-else-if='item.base'>
				<el-option slot='option' value='' label='请选择'></el-option>
			</cc-base>
			<cc-radio v-else-if='item.radio' v-model='data[item.prop]' :list='item.list' :disabled='item.disabled'></cc-radio>
			<cc-select v-else-if='item.select' v-model='data[item.prop]' :options='item.option'>
				<el-option slot='option' value='' label='请选择'></el-option>
			</cc-select>
			<slot v-else-if='item.slot' :name='item.slot'></slot>
			<el-input v-model='data[item.prop]' v-else='item.input'></el-input>
		</div>
		<slot name='capacityDate'></slot>
		<slot name='hidden'></slot>
		<slot name='opt'></slot>
	</div>
</template>
<script>
	export default {
		props: ['cols', 'data'],
		name: 'cc-search',
		components: {
			slotItem: {
				props: ['slots', 'row', 'index'],
				render(h) {
					let vnode = this.slots({
						row: this.row,
						index: this.index
					});
					return h('div', vnode);
				}
			}
		},
	}
</script>
