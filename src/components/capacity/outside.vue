<!-- 外请车辆运力 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">外请人/车运力信息</div>    
      <cc-search :cols='searchCols' :data='search'>
          <div class='opt' slot='opt'>
            <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery' >查询</el-button>
             <el-button type='primary' @click='reset' :disabled='onQuery'>重置</el-button>
          </div>
        </cc-search>
        <el-button v-role='{rt: $route, type: "add"}' class="main-search__btn" type='primary' @click='alert("add", {})'>
          <i class="el-icon-plus"></i>新增
        </el-button>
    </div>
    <cc-table :data='dataList' :cols='cols' :total='total' :settings='settings' @size-change='sizeChange' @current-change='currentChange'>
      <template slot-scope='scope' slot='opt'>
        <el-button type='text'  v-role='{rt: $route, type: "view"}' @click='alert("view", scope.row)'>查看</el-button>
        <el-button type='text'  v-role='{rt: $route, type: "edit"}' @click='alert("edit", scope.row)' >修改</el-button>
        <el-button type='text'  v-role='{rt: $route, type: "delete"}' @click='delRow(scope.row)'>删除</el-button>
        <el-button type='text' @click='PWD(scope.row)' :disabled='onPWD'>初始化密码</el-button>
      </template>
    </cc-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: {},
        searchCols: [
          {
            label: '车牌号',
            input: true,
            prop: 'plate'
          },{
            label: '所属主体',
            prop: 'pleaseType',
            dic: 'PLEASETYPE'
          },{
            label: '车型',
            prop: 'model',
            dic: 'MODEL'
          },{
            label: '能源类型',
            prop: 'energyType',
            dic: 'ENERGYTYPE'
          },{
          	label: '驾驶员姓名',
          	input: true,
          	prop: 'driverName'
          },{
            label: '驾驶员电话',
            input: true,
            prop: 'phone'
          },{
          	label: '所属分公司',
          	base: 'COMPANY',
            prop: 'orgId'
          },{
            label: '公司为他购买保险',
            prop: 'isIns',
            select: true,
            option: [{
                label: '是',
                value: 1
              }, {
                label: '否',
                value: 0
              }
            ]
          }
        ],
        dataList: [{}],
        cols: [
         {
            label: '车牌号',
            prop: 'plate'
          },{
            label: '所属主体',
            prop: 'pleaseType',
            dic: 'PLEASETYPE'
          },{
            label: '车型',
            prop: 'model',
            dic: 'MODEL'
          },{
          	label: '能源类型',
          	prop: 'energyType',
            dic: 'ENERGYTYPE'
          },{
          	label: '驾驶员姓名',
         	  prop: 'driverName'
          },{
            label: '电话',
            prop: 'phone'
          },{
          	label: '身份证号',
          	prop: 'shenfzNo'
          },{
          	label: '驾驶证号',
          	prop: 'driverNo'
          },{
          	label: '现居住地址',
          	prop: 'adderss'
          },{
          	label: '所属分公司',
          	base: 'COMPANY',
            prop: 'orgId'
          },{
            label: '公司为他购买保险',
            width: 120,
            select: true,
            prop: 'isIns',
            format(val) {
              return '1' == val ? '是' : '否';
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
        onQuery: false,
        onPWD: false,
      }
    },
    methods: {
      getData() {
        this.onQuery = true;
        let data =Object.assign({}, this.search, this.query);
        this.axios.post('/capacityManager/queryPleasePowerInfoByPage', data).then(res => {
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
        let title = '新增外部运力资源信息';
        if('edit' == todo) {
          title = '修改外部运力资源信息'
        } else if ('view' == todo) {
          title = '查看外部运力资源信息'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '750px',
            height: '500px',
            title: title,
            url: '/capacity/temp/outside_det.vue',
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
        this.__confirm(this,'','删除外请人/车运力信息',{}).then(res => {
          this.axios.post('/capacityManager/deletePleasePowerInfo', [row.id]).then(res => {
            if(200 == res.code) {
              this.$message.success(res.msg);
              this.getData()
            }
          })
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
        this.axios.get('/capacityManager/resetPowerInfoPassword', {params: {id: row.id}}).then(res => {
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

<style lang="stylus" scoped>
.el-dialog__body span 
    display: block;
    height: 50px;
    float: left;
.el-dialog__body .el-input 
    display: 50px;
    float: left;
    width: 50%
</style>