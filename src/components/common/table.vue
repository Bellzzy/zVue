<template>
	<div class='main-body'>
		<div class='tablebox'>
			<el-table :data='data' :stripe='tabSet.stripe' :border='tabSet.border' :show-summary='tabSet.showSummary' 
				style="width: 100%;" height='100%' size='mini' :summary-method='tabSet.summaryMethod'
				@selection-change='checkboxSelect' @row-dblclick='rowDblclick' @cell-click='cellClick' :span-method='spanMethod'>
		        <el-table-column v-if='"checkbox" == tabSet.select' type="selection" width="50" align='center'></el-table-column>
			    <el-table-column v-if='tabSet.showOrderNo' align='center' type="index" label="序号">
			    	<template slot-scope="scope">{{ scope.row.__index || (scope.$index + 1) }}</template>
			    </el-table-column>
		        <el-table-column v-if='"radio" == tabSet.select' width="50">
		        	<template slot-scope='scope'>
		                <el-radio-group v-model="radioSelect">
		                    <el-radio :label="scope.row" class='xpt-table__radio'></el-radio>
		                </el-radio-group>
		        	</template>
		        </el-table-column>
		        <el-table-column v-for='(item,index) in cols' 
		        	:show-overflow-tooltip='true'
		        	:key='index' 
		        	:label='item.label' 
		        	:prop='item.prop' 
		        	:width='item.width'
		        	:align='item.align || "center"'>
		        	<template slot-scope='scope'>
				    	<slotItem v-if='item.slot' :row='scope.row' :slots='$scopedSlots[item.slot]' :index='scope.$index'></slotItem>
				    	<span v-else-if='item.value'>
				    		{{item.value(scope.row)}}
				    	</span>
				    	<a href='javascript:;' @click='item.redirect(scope.row)' v-else-if='item.redirect'>
				    		{{item.value && item.value(scope.row) || scope.row[item.prop]}}
				    	</a>
				    	<!-- 普通编辑 -->
				    	<template v-else-if='item.edit'>
				    		<el-input v-if='scope.row["_e_"+item.prop]' size='mini' v-model='scope.row[item.prop]' @blur='blur(scope.row, item.prop)' @change='change(scope.row, item.prop)' autofocus='true'></el-input>
				    		<span v-else>{{scope.row[item.prop]}}</span>
				    	</template>
				    	<!-- 时间编辑 -->
				    	<template v-else-if='item.edittime'>
				    		<el-time-picker v-if='scope.row["_e_"+item.prop]' v-model="scope.row[item.prop]" placeholder="选择时间" size='mini' value-format='HH:mm:ss' @blur='blur(scope.row, item.prop)' @change='change(scope.row, item.prop)'></el-time-picker>
				    		<span v-else>{{scope.row[item.prop]}}</span>
				    	</template>
				    	<!-- 日期编辑 -->
				    	<template v-else-if='item.editdate'>
				    		<el-date-picker v-if='scope.row["_e_"+item.prop]' v-model="scope.row[item.prop]" placeholder="选择时间" size='mini' value-format='yyyy-MM-dd' @blur='blur(scope.row, item.prop)' @change='change(scope.row, item.prop)'></el-date-picker>
				    		<span v-else>{{scope.row[item.prop]}}</span>
				    	</template>
				    	<!-- 数据过滤 -->
				    	<span v-else-if='item.format'>{{item.format(scope.row[item.prop])}}</span>
				    	<!-- 过滤器过滤数据 -->
				    	<span v-else-if='item.filter'>{{fm[item.filter](scope.row[item.prop], item.filterParams||'')}}</span>
				    	<!-- 字典 -->
				    	<cc-dic v-else-if='item.dic' v-model='scope.row[item.prop]' :type='item.dic' :disabled='true'></cc-dic>
				    	<!-- 基础数据 -->
				    	<cc-base v-else-if='item.base' v-model='scope.row[item.prop]' :type='item.base' :disabled='true'></cc-base>
				    	<!-- radio组件 -->
						<cc-radio v-else-if='item.radio' v-model='scope.row[item.prop]' :list='item.list' :disabled='true'></cc-radio>
				    	<span v-else>{{scope.row[item.prop]}}</span>
		        	</template>
		        </el-table-column>
			</el-table>
		</div>
	    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page" :page-sizes="[50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class='footer'>
	    </el-pagination>
    </div>
</template>
<script>
	export default {
		name: 'cc-table',
		props: {
			settings: {
				type: Object,
				default: () => {
					return {
						showOrderNo: false,
						// 选择框样式， checkbox为多先框，radio为单选框，默认不显示
						select: '',
						stripe: true,
						border: true
					}
				}
			},
			data: {
				type: Array,
				default: []
			},
			total: 0,
			/*
			[{
				prop: 'name',  					字段
				label: '姓名',					字段名
				edit: true,						是否可以编辑
				valid: ['phone', 'null'],		需要校验集合，名字参考@/validate.js
				slot: 'name'					slot name
			}]
			*/
			cols: {
				type: Array,
				default: []
			},
			'spanMethod': Function
		},
		data() {
			return {
				radioSelect: {},
				page: 1,
				pageSize: this.__pageSize,
				fm: this.$root.$options.filters
			}
		},
		methods: {
			checkboxSelect(select) {
				this.$emit('select-change', select);
			},
			sizeChange(ps) {
				this.pageSize = ps;
				this.$emit('size-change', ps)
			},
			currentChange(page) {
				this.page = page;
				this.$emit('current-change', page)
			},
			rowDblclick(row, event) {
				this.$emit('row-dblclick', row, event)
			},
			blur(row, prop) {
				let arg = '_e_' + prop;
				if(row.hasOwnProperty(arg)) {
					this.$delete(row, arg)
					// row[arg] = false;
					// delete row[arg];
				} 
			},
			change(row, prop) {
				let arg = '_e_' + prop;
				// 校验,校验失败提示消息
				let i = this.cols.length,
					valid = [];
				while(i--) {
					if(prop == this.cols[i].prop) {
						valid = this.cols[i].valid || [];
						break;
					}
				}
				let msg;
				i = valid.length;
				while(i--) {
					msg = this.__Valid[valid[i]](row[prop]);
					if(msg) {
						this.$message.error(msg);
						setTimeout(() => {
							this.$set(row, arg, true)
						})
						return;
					}
				}
				// 校验通过，派发消息
				this.$delete(row, arg);
				// row[arg] = false;
				// delete row[arg];
				this.$emit('edit-change', row, prop)
			},
			cellClick(row, col, cell, e) {
				// 判断该列是否可以编辑
				let i = this.cols.length,
					isEdit = false;
				while(i--) {
					let cols = this.cols[i];
					if(cols.prop && (cols.prop == col.property)) { 
						if(cols.edit) {
							isEdit = cols.edit;
						}
						if(cols.edittime) {
							isEdit = cols.edittime;
						}
						if(cols.editdate) {
							isEdit = cols.editdate;
						}
					}
				}
				if(!isEdit) return;
				
				let arg = '_e_' + col.property;
				if(row.hasOwnProperty(arg)) {
					row[arg] = true;
				} else {
					this.$set(row, arg, true)
				}
				this.$nextTick(() => {
					if(cell.getElementsByTagName('input').length) {
						cell.getElementsByTagName('input')[0].focus()
					}
				})
			}
		},
		watch: {
			// 单选框选择改变时，派发事件
			radioSelect(n, o) {
				this.$emit('select-change', n)
			}
		},
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
		computed: {
			// 是否有opts的slot
			hasOpts() {
				return this.$slots.hasOwnProperty('opts')
			},
			tabSet() {
				return Object.assign({
					showOrderNo: false,
					// 选择框样式， checkbox为多先框，radio为单选框，默认不显示
					select: '',
					stripe: true,
					border: true,
					showSummary: false
				}, this.settings)
			}
		},
		mounted() {
		}
	}
</script>
