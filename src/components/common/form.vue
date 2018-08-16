<!-- el-formitem -->
<template>
<el-form label-position="right" :label-width="formSet.labelWidth" :rules='rules' :model='data' ref='form' status-icon>
	<el-row>
		<el-col v-for='(item,index) in cols' :span='formSet.span' :key='index' >
			<el-form-item v-for='(row,index) in item' :label="row.label" :key='index' :prop='row.prop||row.slot' v-if="!row.isShow" :style="{'margin-top':row.className?'100px':'auto'}">
				<p v-if='row.filter'>{{ft[row.filter](data[row.prop], row.filterParams)}}</p>
				<p v-else-if='row.format'>{{row.format(data[row.prop])}}</p>
				<!-- <p v-else-if='row.formatter'>{{row.formatter(data[row.prop])}}</p> -->
				<a v-else-if='row.redirect' href='javascript:;' @click='row.redirect'><span >{{data[row.prop]}}</span></a>
				<el-date-picker v-else-if='row.date' v-model="data[row.prop]" :value-format='row.format||"yyyy-MM-dd"' type="date" :editable='row.editable||false' placeholder="选择日期" @change='(obj) => row.change?row.change(obj):{}'></el-date-picker>
				<el-input v-else-if='row.input' v-model="data[row.prop]"></el-input>
				<el-input v-else-if='row.textarea' v-model="data[row.prop]" type='textarea' :rows='row.rows || 4'></el-input>
				<cc-dic v-else-if='row.dic' @change='(obj) => row.change?row.change(obj):{}' v-model='data[row.prop]' 
					:type='row.dic' :getLabel='row.getLabel' :disabled='row.disabled'>
					<el-option slot='option' value='' label='请选择'></el-option>
				</cc-dic>
				<cc-base v-else-if='row.base' @change='(obj) => row.change?row.change(obj):{}' v-model='data[row.prop]' 
					:type='row.base' :getLabel='row.getLabel' :disabled='row.disabled'>
					<el-option slot='option' value='' label='请选择'></el-option>
				</cc-base>
				<cc-radio v-else-if='row.radio' v-model='data[row.prop]' :list='row.list' :disabled='row.disabled' @change='(obj) => row.change?row.change(obj):{}'></cc-radio>
				<cc-select v-else-if='row.select' v-model='data[row.prop]' :options='row.option' :disabled='row.disabled'></cc-select>
				<slot v-else-if='row.slot' :name='row.slot'></slot>
				<span v-else>{{data[row.prop]}}</span>
			</el-form-item>
		</el-col>
	</el-row>
	<el-row>
		<slot name='row'></slot>
	</el-row>
	<el-row>
		<el-form-item>
			<slot name='btns'></slot>
		</el-form-item>
	</el-row>
</el-form>
</template>
<script>
export default {
	name: 'cc-form',
	props: {
		cols: {
			type: Array,
			default() {
				return []
			}
		},
		data: {
			type: Object,
			default() {
				return {}
			}
		},
		rules: {
			type: Object,
			default() {
				return {}
			}
		},
		settings: Object
	},
	data() {
		let self = this;
		return {
			ft: self.$root.$options.filters
		}
	},
	methods: {
		validate(resolve) {
        	this.$refs.form.validate(valid => {
        		if(valid) {
        			resolve && resolve();
        		}
        	})
		}
	},
	mounted() {
	},
	computed: {
		formSet() {
			return Object.assign({
				labelWidth: '80px',
				span: Math.floor(24 / this.cols.length)
			}, this.settings)
		}
	}
}
</script>
