import Vue from 'vue'
import table from './table'
import form from './form'
import dictionary from './dictionary'
import search from './search'
import base from './base'
import radio from './radio'
import select from './select'
import date from './date'
import editor from './editor'
// 注册全局组件
export default {
	install() {
		let components = [table, form, dictionary, search, base, radio, date, select, editor],
			i = components.length;
		while(i--) {
			Vue.component(components[i].name, components[i]);
		}
	}
}
