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
            menuList: [
            	{
            		type: 0,
            		title: '系统设置',
            		list: [
            			{
            				type: 0,
            				title: '用户管理',
            				href: 'system/user'
            			}, {
            				type: 0,
            				title: '菜单管理',
            				href: 'system/menu'
            			}, {
            				type: 0,
            				title: '角色管理',
            				href: 'system/role'
            			}, {
            				type: 0,
            				title: '帮助设置',
            				href: 'app/help'
            			}, {
            				type: 0,
            				title: '调度管理',
            				href: 'diaodu/daily'
            			}
            		]
            	}
            ],
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
			temp = true
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
	},
	mounted() {
        this.activePath = this.$route.query.link;
       	this.loadComponent(this.activePath );
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
