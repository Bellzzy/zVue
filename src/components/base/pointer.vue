<!-- 点部管理 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">点部管理</div>    
       <cc-search :cols='searchCols' :data='search'>
          <div class='opt' slot='opt'>
            <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery' >查询</el-button>
            <el-button @click='__reset(search)' >重置</el-button>
          </div>
        </cc-search>
        <el-button class="main-search__btn" type='primary' @click='alert("add", {})' v-role='{rt: $route, type: "add"}'>
          <i class="el-icon-plus"></i>新增
        </el-button>
    </div>
    <cc-table :data='dataList' :cols='cols' :total='total' :settings='settings' @size-change='sizeChange' @current-change='currentChange'>
      <template slot-scope='scope' slot='opt'>
        <el-button type='text' @click='alert("view", scope.row)' v-role='{rt: $route, type: "view"}'>查看</el-button>
        <el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>编辑</el-button>
        <el-button type='text' @click='delRow(scope.row)' v-role='{rt: $route, type: "delete"}'>删除</el-button>
      </template>
    </cc-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: {
          customerId: '',
          partName: ''
        },
        searchCols: [
        {
            label: '所属客户',
            base: 'CUSTOMER',
            prop: 'customerId'
          },{
            label: '点部名称',
            input: true,
            prop: 'partName'
          }
        ],
        dataList: [],
        cols: [
          {
            label: '点部名称',
            prop: 'partName'
          }, {
            label: '详细地址',
            prop: 'address'
          }, {
            label: '所属公司',
            prop: 'orgId',
            base: 'COMPANY'
          }, {
            label: '所属区域',
            prop: 'quId',
            base: 'REGIONS'
          }, {
            label: '所属客户',
            prop: 'customerId',
            base: 'CUSTOMER'
          }, {
            label: '操作',
            width: 150,
            slot: 'opt'
          }
        ],
        total: 0,
        query: {
          page: 1,
          rows: this.__rows
        },
        onQuery: false,
        settings: {
          showOrderNo: true
        }
      }
    },
    methods: {
      getData() {
        this.onQuery = true;
        let data =Object.assign({}, this.search, this.query);
        this.axios.post('/tmsPartInfo/queryListByPage', data).then(res => {
          if(200 == res.code) {
            this.dataList = res.data || [];
            this.total = res.count;
          }
          this.onQuery = false;
        }).catch(err => {
          this.onQuery = false;
        })
      },
      alert(todo, row) {
        let title= '新增点部';
        if('view' == todo) {
          title = '查看点部'
        } else if('edit' == todo) {
          title = '编辑点部'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '300px',
            height: '320px',
            title: title,
            url: '/base/temp/pointer_det.vue',
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
      sizeChange(pageSize) {
        this.query.rows = pageSize;
        this.getData();
      },
      currentChange(page) {
        this.query.page = page;
        this.getData()
      },
      delRow(row) {
        this.__confirm(this).then(res => {
          this.axios.post('/tmsPartInfo/delete', {id: row.id}).then(res => {
            if(200 == res.code) {
              this.$message.success(res.msg);
              this.getData()
            }
          })
        }).catch(err => {})
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

