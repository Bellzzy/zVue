<!-- 外请搬运工 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">外请搬运工信息</div>    
       <cc-search :cols='searchCols' :data='search'>
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
        <el-button type='text' v-role='{rt: $route, type: "edit"}' @click='alert("edit", scope.row)'>修改</el-button>
        <el-button type='text' v-role='{rt: $route, type: "delete"}' @click='delRow(scope.row)'>删除</el-button>
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
          endAge: ''
        },
        searchCols: [
          {
            label: '姓名',
            input: true,
            prop: 'name'
          },{
            label: '电话',
            input: true,
            prop: 'phone'
          },{
            label: '身份证号',
            input: true,
            prop: 'shenfzNo'
          },{
            label: '归属公司',
            base: 'COMPANY',
            prop: 'orgId'
          }
        ],
        dataList: [],
        cols: [
          {
            label: '姓名',
            prop: 'name'
          }, {
            label: '性别',
            select: true,
            prop: 'sex',
            format(val) {
              return '1' == val ? '男' : '女';
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
          	label: '现居地址',
          	prop: 'address'
          },{
          	label: '归属公司',
          	prop: 'orgId',
            base: 'COMPANY'
          },{
          	label: '操作',
          	slot:'opt'
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
      }
    },
    methods: {
      getData() {
          this.onQuery = true;
          let data =Object.assign({}, this.search, this.query);
          this.axios.post('/capacityManager/queryPleaseCarrierInfoByPage', data).then(res => {
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
        let title = '新增外请搬运工资源信息';
        if('edit' == todo) {
          title = '编辑用户'
        } else if ('view' == todo) {
          title = '查看用户'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '700px',
            height: '400px',
            title: title,
            url: '/capacity/temp/outsidePorter_det.vue',
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
         this.__confirm(this, '', '删除外请搬运工信息', {}).then(res => {
          this.axios.post('/capacityManager/deletePleaseCarrierInfo',[row.id]).then(res => {
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
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>
