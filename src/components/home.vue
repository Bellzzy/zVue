<template>
	<div class='main'>
		<!-- <el-button v-role='{rt: $route, type: "add"}'>测试</el-button> -->
	</div>
</template>
<script>
export default {
	data() {
		return {

		}
	},
	mounted() {
		// let data = sessionStorage.getItem('allMenuList'),
		// 	i, obj = {}, obj2 = {}, level3Arr = [];
		// data = data ? JSON.parse(data) : [];
		// i = data.length;
		// while(i--) {
		// 	if(-1 == data[i].parentId) {
		// 		data[i].list = []
		// 		obj[data[i].id] = data[i]
		// 	} else {
		// 		if(0 == data[i].type) {
		// 			data[i].list = []
		// 			obj2[data[i].id] = data[i];
		// 		} else {
		// 			level3Arr.push(data[i])
		// 		}
		// 	}
		// }
		// i = level3Arr.length;
		// while(i--) {
		// 	if(obj2[level3Arr[i].parentId]) {
		// 		obj2[[level3Arr[i].parentId]].list.push(level3Arr[i])
		// 	}
		// }
		// for(let item in obj2) {
		// 	let temp = obj2[item]
		// 	if(obj[temp.parentId]) {
		// 		obj[temp.parentId].list.push(temp)
		// 	}
		// }
		// let arr = [];
		// for(let item in obj) {
		// 	arr.push(obj[item])
		// }
	}
}
</script>
