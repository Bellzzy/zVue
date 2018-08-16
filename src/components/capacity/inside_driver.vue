<!-- 内部货运师 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">内部货运师信息</div>    
       <cc-search :cols='searchCols' :data='search'>
          <template slot='age'>
            <el-input v-model='search.startAge' class='min'></el-input>
            ~
            <el-input v-model='search.endAge' class='min'></el-input>
          </template>
          <div class='opt' slot='opt'>
             <el-button v-role='{rt: $route, type: "add"}' class="main-search__btn" type='primary' @click='alert("add", {})'>
              <i class="el-icon-plus"></i>新增
            </el-button>
            <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery' >查询</el-button>
            <el-button type='primary' @click='reset'>重置</el-button>
          </div>
        </cc-search>
    </div>
    <cc-table :data='dataList' :cols='cols' :total='total' :settings='settings' @size-change='sizeChange' @current-change='currentChange'>
      <template slot-scope='scope' slot='opt'>
        <el-button type='text' v-role='{rt: $route, type: "view"}' @click='alert("view", scope.row)'>查看</el-button>
        <el-button type='text' v-role='{rt: $route, type: "edit"}' @click='alert("edit", scope.row)' 
        v-if='("1" ==scope.row.state)'>修改</el-button>
        <el-button type='text' v-role='{rt: $route, type: "edit"}'  @click='delRow(scope.row)'>{{0 == scope.row.state ? '启用' : '禁用'}}</el-button>
        <el-button type='text' @click='PWD(scope.row)' :disabled='onPWD' :loading='onPWD' v-if='("1" ==scope.row.state)'>初始化密码</el-button>
      </template>
    </cc-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: {
          startAge: '',
          endAge: '',
          startDiverAge: '',
          endDiverAge: ''
        },
        searchCols: [
          {
            label: '驾驶员姓名',
            input: true,
            prop: 'name'
          },{
            label: '年龄',
            slot: 'age'
          },{
            label: '是否有货运师证',
            prop: 'isCate',
            select: true,
            option: [{
              label: '是',
              value: 1
            },{
              label: '否',
              value: 0
            }]
          },{
            label: '驾驶员电话',
            input: true,
            prop: 'phone'
          },{
            label: '驾驶证类型',
            prop: 'type',
            dic: 'DRIVERTYPE'
          },{
            label: '所属公司',
            base: 'COMPANY',
            prop: 'orgId'
          },{
            label: '身份证号',
            input: true,
            prop: 'shenfzNo'
          },{
          	label: '是否签订协议',
          	prop: 'isAgre',
            select: true,
            option: [{
              label: '是',
              value: 1
            },{
              label: '否',
              value: 0
            }]
          },{
          	label: '服务客服',
          	base: 'CUSTOMER',
          	prop: 'cusId'
          }
        ],
        dataList: [],
        cols: [
          {
            label: '驾驶员姓名',
            prop: 'name'
          }, {
            label: '性别',
            select: true,
            prop: 'sex',
            format(val) {
              return '0' == val ? '男' : '女';
            }
          },{
          	label: '电话',
          	prop: 'phone'
          },{
          	label: '身份证号',
         	  prop: 'shenfzNo'
          },{
          	label: '年龄',
          	prop: 'age'
          },{
          	label: '驾驶证类型',
          	prop: 'type',
            dic: 'DRIVERTYPE'
          },{
            label: '是否有货运师证',
            width: 110,
            select: true,
            prop: 'isCate',
            format(val) {
              return '1' == val ? '是' : '否';
            }
          },{
            label: '是否签订协议',
            select: true,
            width: 100,
            prop: 'isAgre',
            format(val) {
              return '1' == val ? '是' : '否';
            }
          },{
            label: '所属分公司',
            base: 'COMPANY',
            prop: 'orgId'
          },{
            label: '服务客户',
            prop: 'cusId',
            base: 'CUSTOMER'
          },{
            label: '状态',
            prop: 'state',
            format(val) {
              return '1' == val ? '启用' : '禁用'
            }
          },{
          	label: '操作',
            width: 240,
          	slot: 'opt'
          }
        ],
        total: 0,
        settings: {
          showOrderNo: true,
        },
        query: {
          page: 1,
          rows: this.__rows
        },
        dialogVisible: false,
        onQuery: false,
        onDelete: false,
        onUpload: false,
        onExport: false,
        onPWD: false,
      }
    },
    methods: {
      getData() {
          this.onQuery = true;
          let data =Object.assign({}, this.search, this.query);
          this.axios.post('/capacityManager/queryDriverInfoByPage', data).then(res => {
            this.onQuery = false;
            if(200 == res.code) {
              this.dataList = res.data || [];
              this.total = res.count;
            }
          }).catch(err => {
            this.onQuery = false
          })
      },
      reset() {
      	this.__reset(this.search)
      },
      alert(todo, row) {
        let title = '新增内部货运师信息';
        if('edit' == todo) {
          title = '修改内部货运师信息'
        } else if ('view' == todo) {
          title = '查看内部货运师信息'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '700px',
            height: '550px',
            title: title,
            url: '/capacity/temp/insideDriver_det.vue',
            props: {
              row: row,
              todo: todo,
              callback: resolve
            }
          })
        }).then(_=>{
          this.getData()
        })
      },
      delRow(row) {
        this.axios.get('/capacityManager/changeDriverState', {params: {id: row.id}}).then(res => {
            if(200 == res.code) {
              this.$message.success(res.msg);
              this.getData()
            }
        }).catch(err => {
          console.log(err)
        })
      },
      sizeChange(pageSize) {
        this.query.rows = pageSize;
        this.getData();
      },
      currentChange(page) {
        this.query.page = page;
        this.getData()
      },
      PWD(row) { 
        this.axios.get('/capacityManager/resetDriverPassword', {params: {id: row.id}}).then(res => {
          if(200 == res.code) {
            this.$message.success(res.msg);
          }
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>
<style lang='stylus' scoped>
.min
  width: 48px !important
.el-input.min 
  width: 48px !important
.upload-demo
  display: inline-block
  margin-left: 10px
  margin-right: 10px

.el-dialog__body span 
    display: block;
    height: 50px;
    float: left;
.el-dialog__body .el-input 
    display: 50px;
    float: left;
    width: 50%
</style>