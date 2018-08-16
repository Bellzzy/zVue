<template>
	<div id="app">
    	<div class='navbar'>
    		<span class='signout'><el-button type='text' @click='signout'>注销<i class='el-icon-d-arrow-right'></i></el-button></span>
    		<span class='userinfo'>欢迎您：{{userName}}</span>
    	</div>
		<div class='menu'>
			<h1>曹操货的TMS后台管理系统</h1>
	        <el-menu
				:default-active="activePath"
				:unique-opened='true'
				class="el-menu-vertical-demo"
				@select="menuSelect"
				background-color="#2c3b41"
				text-color='#fff'>
                <!-- <el-menu-item index='app/notice'>
                    <i class="el-icon-bell"></i>
                    <span slot="title">公告</span>
                </el-menu-item> -->
	            <p v-for='(item,index) in menuList' :key='index' v-if='0==item.type'>
	                <el-submenu :index='index + ""' v-if='item.list'>
	                    <template slot="title">
	                        <i :class="item.icon"></i>
	                        <span>{{item.title}}</span>
	                    </template>
	                    <el-menu-item v-for='(row,key) in item.list' :key='key' :index='row.href'>
		                    <i class="el-icon-info"></i>
		                    <span slot="title">{{row.title}}</span>
		                </el-menu-item>
	                </el-submenu>
	                <el-menu-item v-else :index='item.href'>
	                    <i :class="item.icon"></i>
	                    <span slot="title">{{item.title}}</span>
	                </el-menu-item>
	            </p>
	        </el-menu>
	    </div>
		<component :is='component' @openAlert='openAlert' @updateCache='updateCache'></component>
		<div class='alert' v-for='(item,index) in alert' :key='item.id'>
			<div class='alert-body' :style="'width:' + item.width + '; height: ' + item.height">
				<div class='alert-body__title'>
					<strong>{{item.title}}</strong>
					<div class='close' @click='closeAlert(index)'>
						<i class='el-icon-close'></i>
					</div>
				</div>
				<component :is='item.component' :params='item.props' @close='closeAlert(index)' @updateCache='updateCache'></component>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
const loadingComponent = {
	template: `
		<div class='loading'><i /><i /><i /><i /><i /></div>
	`
}

export default {
	name: "home",
	data() {
		return {
			component: loadingComponent,
			alert: [],
			roleList: new Set(['home']),
			activePath: "home",
            menuList: [],
            list: [],
            userName: '',
            ids: ''
		}
	},
	methods: {
		signout() {
			sessionStorage.removeItem('token')
			this.$router.push({
				path: '/'
			})
		},
		menuSelect(link) {
			this.$router.push({
				path: 'main',
				query: {
					link: link
				}
			})
		},
		loadComponent(link) {
			link = link || 'home';
			let errorComponent = {
					template: `
						<div class='main error'>
							<div class='info'><h1>404</h1>找不到页面：`
							+ link + 
							`<br>请检查网络链接是否正常和地址路径是否正确。<br><br>
								<el-button type='primary' size='medium' @click='reload'>重新加载</el-button>
								<el-button type='success' size='medium' @click='back'>返回上一页</el-button>
							</div>
						</div>
					`,
					methods: {
						reload() {
							location.reload();
						},
						back() {
							this.$router.go(-1);
						}
					}
				};
			this.component = loadingComponent;
			// 校验请求的地址是否在返回的菜单里，校验不成功直接返回404
			let temp = this.roleList.has(link);
			// 不拦截的菜单
			if(!temp) {
				let noMenu = new Set(['home', 'app/notice']);
				temp = noMenu.has(link);
			}
			if(temp) {
				import('@/components/' + link).then(res => {
					this.component = res.default;
				}).catch(err => {
					this.component = errorComponent;
				});
			} else {
				this.component = errorComponent;
			}
		},
		closeAlert(index) {
			this.alert.splice(this.alert.length - 1, 1);
		},
		openAlert(obj) {
			obj.component = loadingComponent
			import('@/components' + obj.url).then(res => {
				obj.component = res.default;
			}).catch(err => {
				obj.component = {
					template: `
						<div class='alert-body__component'>
							<div class='errorinfo'><h1>404</h1>找不到页面：`
							+ obj.url + 
							`<br>请检查网络链接是否正常和地址路径是否正确。
							</div>
						</div>
					`
				};
			})
			this.alert.push(obj);
		},
		// 获取所有字典数据
		getAllDictionary() {
			this.axios.post('/dictionary/queryDictionariesByPage', {}).then(res => {
				if(200 == res.code) {
					sessionStorage.setItem('DICDATA', JSON.stringify(res.data));
					// 派发事件，更新字典列表的数据
					this.$root.events.$emit('updateDic')
				}
			})
		},
		// 获取基础数据
		getBase(type, resolve) {
			let dataUrl,
				method = 'post',
				nameKey = 'name',
				timer = +new Date()
			switch(type) {
				// 组织机构
				case 'COMPANY': dataUrl = '/tmsOrgInfo/queryListByPage'; nameKey = 'orgFullName'; break;
				// 客户信息
				case 'CUSTOMER': dataUrl = '/customerController/getAll?t=' + timer; method = 'get'; nameKey = 'cusname'; break;
				// 外请搬运工
				case 'OUTSIDEPORTER': dataUrl = '/capacityManager/getAllPleaseCarrierInfo?t=' + timer; method = 'get'; break;
				// 外请运力车辆
				case 'OUTSIDECAR': dataUrl = '/capacityManager/getAllPleasePowerInfo?t=' + timer; method = 'get'; nameKey = 'plate'; break;
				// 内部运力
				case 'INSIDECAR': dataUrl = '/capacityManager/getAllVehicleInfo?t=' + timer; method = 'get'; nameKey = 'plate'; break;
				// 内部货运师
				case 'INSIDEDRIVER': dataUrl = '/capacityManager/getAllDriverInfo?t=' + timer; method = 'get'; break;
				// 项目负责人
				case 'PM': dataUrl = '/tmsProjectInfo/queryListByPage'; nameKey = 'leName'; break;
				// 点部管理
				case 'POINT': dataUrl = '/tmsPartInfo/queryListByPage'; nameKey = 'partName'; break;
				// 业务员
				case 'SALESMAN': dataUrl = '/SalesmanController/salegetAll?t=' + timer; method = 'get'; break;
				// 货物类型
				case 'GOODSTYPE': dataUrl = '/GoodsTypeController/GoodsTypegetAll?t=' + timer; method = 'get'; nameKey = 'typename'; break;
				// 城市
				case 'CITY': dataUrl = '/data/getAllCityInfo?t=' + timer; method = 'get'; nameKey = 'cityName'; break;
				// 行政区域
				case 'REGIONS': dataUrl = '/data/getAllAreaInfo?t=' + timer; method = 'get'; nameKey = 'areaName'; break;
				// 租赁公司
				case 'LEASING': dataUrl = '/data/getAllLeaseInfo?t=' + timer; method = 'get'; nameKey = 'leaseName'; break;
				default: dataUrl = ''; break;
			}
			if(!dataUrl) return;
			this.axios({
				method: method,
				url: dataUrl,
				data: {
					page: 1,
					rows: '2147483647'
				}
			}).then(res => {
				let data = res.data || [],
					i = data.length;
				while(i--) {
					data[i].name = data[i][nameKey]
				}
				let baseData = sessionStorage.getItem('BASEDATA');
				baseData = baseData ? JSON.parse(baseData) : {};
				baseData[type] = data || [];
				sessionStorage.setItem('BASEDATA', JSON.stringify(baseData));
				resolve && resolve();
			})
		},
		// 获取所有的菜单列表
        getAllMenu(resolve) {
			this.axios.get('/user/permissioncontroller/getAllPermissions', {}).then(res => {
				if(200 == res.code) {
					sessionStorage.setItem('allMenuList', JSON.stringify(res.data));
					// 派发事件，更新菜单列表的数据
					this.$root.events.$emit('updateMenu')
				}
				resolve && resolve();
			}).catch(err => {
				resolve && resolve();
			})
        },
        // 获取所有角色列表
        getAllRole(resolve) {
        	this.axios.post('/user/role/getList', {}).then(res => {
        		if(200 == res.code) {
					let baseData = sessionStorage.getItem('BASEDATA');
					baseData = baseData ? JSON.parse(baseData) : {};
					let data = res.data || [],
						i = data.length;
					while(i--) {
						data[i].name = data[i].roleName;
					}
					baseData["ROLE"] = data;
					sessionStorage.setItem('BASEDATA', JSON.stringify(baseData));
        		}
        		resolve && resolve();
        	}).catch(err => {
        		resolve && resolve()
        	})
        },
        // 获取当前用户的登录信息
        getMenuList(resolve) {
            this.axios.get('/user/usercontroller/getLoginUserInfo', {}).then(res => {
            	if(200 == res.code && res.data) {
					// 获取当前用户的权限
					let roleObj, menus;
					let data = sessionStorage.getItem('BASEDATA');
					data = data ? JSON.parse(data) : {};
					data = data['ROLE'] || [];
					let i = data.length;
					while(i--) {
						if(res.data.roleId == data[i].id) {
							roleObj = data[i];
							break;
						}
					}
					this.menuList = this.__menuTree(roleObj.ids);
					menus = this.__getSelectMenu(roleObj.ids);
					i = menus.length;
					// 按钮权限拦截
					let arr = [],
						roleList = [];
					while(i--) {
						if(1 == menus[i].type) {
							arr.push({
								href: menus[i].href,
								code: menus[i].code
							})
						}
						roleList.push(menus[i].href);
					}
					this.roleList = new Set(roleList);
					sessionStorage.setItem('BTNLIST', JSON.stringify(arr));	
					this.userName = res.data.userName;
					resolve && resolve()
            	} else {
            		this.signout()
            	}
            }).catch(err => {
                resolve && resolve()
            })
        },
       	/*
        更新本地缓存
        子组件派发updateCache事件触发 
        obj.type为需要更新的数据
        */
        updateCache(obj) {
        	if('dic' == obj.type) {
        		// 更新字典
        		this.getAllDictionary()
        	} else if('pm' == obj.type) {
        		// 更新项目负责人
        		this.getBase('PM')
        	} else if('group' == obj.type) {
        		// 更新组织机构
        		this.getBase('COMPANY')
        	} else if('point' == obj.type) {
        		// 更新点部
        		this.getBase('POINT')
        	} else if('customer' == obj.type) {
        		// 更新客户
        		this.getBase('CUSTOMER')
        	} else if('salesman' == obj.type) {
        		// 更新业务员
        		this.getBase('SALESMAN')
        	} else if('goodstype' == obj.type) {
        		// 更新货物类型
        		this.getBase('GOODSTYPE')
        	} else if('menu' == obj.type) {
        		// 更新菜单
        		this.getAllMenu()
        	} else if('role' == obj.type) {
        		// 获取所有角色
        		this.getAllRole();
        	} else if('city' == obj.type) {
        		// 获取所有城市
        		this.getBase('CITY');
        	} else if('regions' == obj.type) {
        		// 获取所有行政区域
        		this.getBase('REGIONS');
        	} else if('leasing' == obj.type) {
        		// 获取所有租赁公司
        		this.getBase('LEASING');
        	}
        }
	},
	mounted() {
        this.activePath = this.$route.query.link;
        // 优先获取所有的菜单和权限
		new Promise(res => {
			let roleAll = new Promise(resolve => {
					this.getAllRole(resolve)
				}),
				menuAll = new Promise(resolve => {
					this.getAllMenu(resolve)
				});
			Promise.all([roleAll, menuAll]).then(result => {
				this.getMenuList(res);
			})
		}).then(() => {
			this.loadComponent(this.$route.query.link);
		})
		// 获取所有字典
		this.getAllDictionary();
		// 获取基础数据；组织机构、点部、项目负责人、客户、业务员、货物类型、城市、行政区域、租赁公司、外请搬运工、外部车辆运力、内部货运师、内部车辆运力
       	let baseList = ['COMPANY', 'POINT', 'PM', 'CUSTOMER', 'SALESMAN', 'GOODSTYPE', 'CITY', 'REGIONS', 
       		'LEASING', 'OUTSIDEPORTER', 'OUTSIDECAR', 'INSIDECAR', 'INSIDEDRIVER'],
       		i = baseList.length;
       	while(i--) {
       		this.getBase(baseList[i]);
       	}

	},
	watch: {
		$route(n) {
			let link = n.query.link;
			this.loadComponent(link)
		}
	}
};
</script>
<style lang="stylus">
@import '../assets/main.styl'
</style>
