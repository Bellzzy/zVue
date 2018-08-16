<!-- 项目负责人 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">项目负责人</div>    
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
        <el-button type='text' @click='alert("edit", scope.row)' v-role='{rt: $route, type: "edit"}'>修改</el-button>
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
          leName: '',
          orgId: ''
        },
        searchCols: [
        {
            label: '负责人姓名',
            input: true,
            prop: 'leName'
          },{
            label: '所属公司',
            base: 'COMPANY',
            prop: 'orgId'
          }
        ],
        dataList: [],
        cols: [
          {
            label: '负责人姓名',
            prop: 'leName'
          },{
            label: '性别', 
            prop: 'sex',
            select: true,
            format(val) {
              return '1' == val ? '男' : '女';
            }
          }, {
            label: '联系电话',
            prop: 'phone'
          }, {
            label: '身份证号码',
            prop: 'identityNo'
          }, {
            label: '文化程度',
            prop: 'culture'
          }, {
            label: '所属公司',
            prop: 'orgId',
            base: 'COMPANY'
          },{
            label: '状态',
            prop: 'state',
            dic: 'STATUS'
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
        this.axios.post('/tmsProjectInfo/queryListByPage', data).then(res => {
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
        let title= '新增项目负责人';
        if('view' == todo) {
          title = '查看项目负责人';
        } else if('edit' == todo) {
          title = '编辑项目负责人';
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '600px',
            height: '300px',
            title: title,
            url: '/capacity/temp/pm_det.vue',
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
        this.getData()
      },
      currentChange(page) {
        this.query.page = page;
        this.getData()
      },
      delRow(row) {
        this.__confirm(this).then(res => {
          this.axios.post('/tmsProjectInfo/delete', {id: row.id}).then(res => {
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

