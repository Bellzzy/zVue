<!-- 内部货运师 -->
<template>
	<div class="alert-body__component">
		<cc-form :data='data' :cols='baseCols' :rules='baseRules' :settings='formSet' ref='form'>
			<el-form-item slot='row' label='备注'>
				<span v-if='"view" == params.todo'>{{data.remark}}</span>
				<el-input type='textarea' :rows='5' v-model='data.remark' style='width: 90%' v-else></el-input>
			</el-form-item>
			<a href='javascript:;' v-view slot='url' :url='data.url' v-if='data.url'>点击查看</a>
			<el-upload
				class="upload-demo"
				action="/cc-tms/fileUpload/getFilePath"
				:on-progress='()=> this.onUpload1 = true'
				:on-success='(res) => uploadSuccess(res, "url")'
				:on-error='uploadError'
				:show-file-list="false" slot='url' v-if='"view" != params.todo'>
				<el-button size="small" type="primary" :disabled='onUpload1' :loading='onUpload1'>上传</el-button>
			</el-upload>
			<a href='javascript:;' v-view slot='agreUrl' :url='data.agreUrl' v-if='data.agreUrl'>点击查看</a>
			<el-upload
				class="upload-demo"
				action="/cc-tms/fileUpload/getFilePath"
				:on-progress='()=> this.onUpload2 = true'
				:on-success='(res) => uploadSuccess(res, "agreUrl")'
				:on-error='uploadError'
				:show-file-list="false" slot='agreUrl' v-if='"view" != params.todo'>
				<el-button size="small" type="primary" :disabled='onUpload2' :loading='onUpload2'>上传</el-button>
			</el-upload>
			<a href='javascript:;' v-view slot='cateUrl' :url='data.cateUrl' v-if='data.cateUrl'>点击查看</a>
			<el-upload
				class="upload-demo"
				action="/cc-tms/fileUpload/getFilePath"
				:on-progress='()=> this.onUpload3 = true'
				:on-success='(res) => uploadSuccess(res, "cateUrl")'
				:on-error='uploadError'
				:show-file-list="false" slot='cateUrl' v-if='"view" != params.todo'>
				<el-button size="small" type="primary" :disabled='onUpload3' :loading='onUpload3'>上传</el-button>
			</el-upload>
		</cc-form>
		<div class="opt">
			<el-button v-if='"view" != params.todo' type='success' @click='submit' :loading='onSubmit' :disabled='onSubmit'>提交</el-button>
			<el-button type='danger' @click="$emit('close')">关闭</el-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['params'],
		data() {
			return {
				data: {
					id: '',
					name: '',
					sex: '',
					phone: '',
					shenfzNo: '',
					age: '',
					type: '',
					url: '',
					isCate: '',
					cateUrl: '',
					isAgre: '',
					agreUrl: '',
					orgId: '',
					adderss: '',
					cusId: '',
					remark: ''
				},
				baseCols: [
					[
						{
							label: '驾驶员姓名',
							prop: 'name',
							input: true
						},{
							label: '驾驶员性别',
							select: true,
							prop: 'sex',
							option: [{
								label: '女',
								value: 1
							},{
								label: '男',
								value: 0
							}]
						},{
							label: '联系电话',
							input: true,
							prop: 'phone'
						},{
							label: '身份证号',
							input: true,
							prop: 'shenfzNo'
						},{
							label: '年龄',
							input: true,
							prop: 'age'
						},{
							label: '驾驶证类型',
							prop: 'type',
            				dic: 'DRIVERTYPE'
						},{
							label: '驾驶证图片',
							slot: 'url',
						}
					],[
						{
							label: '是否有货运师证',
							select: true,
							prop: 'isCate',
							option: [{
								label: '是',
								value: 1
							},{
								label: '否',
								value: 0
							}]
						},{
							label: '货运师证附件',
							slot: 'cateUrl',
						},{
							label: '是否签订劳动协议',
							select: true,
							prop: 'isAgre',
							option: [{
								label: '是',
								value: 1
							},{
								label: '否',
								value: 0
							}]
						},{
							label: '劳动协议附件',
							slot: 'agreUrl'
						},{
							label: '现居地址',
							input: true,
							prop: 'adderss'
						},{
							label: '所属分公司',
							base: 'COMPANY',
							prop: 'orgId'
						},{
				          	label: '服务客户',
				          	prop: 'cusId',
				          	base: 'CUSTOMER'
				          }
					],
				],
				baseRules: {
					name: this.__Valid.init(['null']),
					sex: this.__Valid.init(['null']),
					phone: this.__Valid.init(['phone']),
					shenfzNo: this.__Valid.init(['card']),
					age: this.__Valid.init(['null']),
					type: this.__Valid.init(['null']),
					// statu: this.__Valid.init(['null'])
					// 驾驶证图片
					// url: this.__Valid.init(['null']),					
				},
				formSet: {
					span: 12,
					labelWidth: '120px'
				},
				onSubmit: false,
				onUpload1: false,
				onUpload2: false,
				onUpload3: false
			}
		},
		methods: {
			submit(){
				new Promise((resolve) => {
					this.$refs.form.validate(resolve)
				}).then(s => {
					let data = JSON.parse(JSON.stringify(this.data))
					let dataUrl = '/capacityManager/addDriverInfo'
					if (this.data.id) {
						dataUrl = '/capacityManager/editDriverInfo'
					}
					this.axios.post(dataUrl, data).then(res => {
						this.onSubmit = false;
						if(200 == res.code) {
							this.$message.success(res.msg)
							this.$emit('close');
							this.params.callback && this.params.callback();
							this.$emit('updateBase', 'OUTSIDE');
						}
					}).catch(err => {
						this.onSubmit = false;
					})
				})
			},
			choose() {
				alert('a')
			},
			uploadSuccess(res, arg) {
				if(200 == res.code) {
					this.data[arg] = res.data;
				}
				this.onUpload1 = false;
				this.onUpload2 = false;
				this.onUpload3 = false;
			},
			uploadError(res) {
				if(res instanceof Error) {
					this.message.error(res.status)
				} else {
					this.message.error('上传失败')
				}
				this.onUpload1 = false;
				this.onUpload2 = false;
				this.onUpload3 = false;
			},
			getFileName(file) {
				console.log(file)
				let files = file.split('/'),
					len = files.length;
				return files[len-1];
			}
		},
		mounted() {
			if('add' != this.params.todo) {
				this.__setValue(this.data, this.params.row);
			}
			if('view' == this.params.todo) {
				this.__alertView(this.baseCols);
				this.baseRules = {}
			}
		}
	}
</script>
<style lang="stylus" scoped>
.upload-demo
	display: inline-block
	margin-left: 10px
</style>