<!-- 组织机构 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">组织机构</div>    
       <cc-search :cols='searchCols' :data='search'>
          <div class='opt' slot='opt'>
            <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery' >查询</el-button>
            <el-button @click='__reset(search)'>重置</el-button>
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
          orgFullName: '',
          cityId: ''
        },
        searchCols: [
          {
            label: '机构全称',
            input: true,
            prop: 'orgFullName'
          }, {
            label: '所在城市',
            base: 'CITY',
            prop: 'cityId'
          }
        ],
        dataList: [],
        cols: [
          {
            label: '机构全称',
            prop: 'orgFullName'
          }, {
            label: '机构简称',
            prop: 'orgShortName'
          }, {
            label: '机构代码',
            prop: 'orgCode'
          }, {
            label: '机构负责人',
            width: 100,
            prop: 'orgLeader'
          }, {
            label: '负责人电话',
            width: 100,
            prop: 'orgPhone'
          }, {
            label: '邮箱地址',
            prop: 'orgEmail'
          }, {
            label: '机构地址',
            prop: 'orgAddress'
          }, {
            label: '所在城市',
            prop: 'cityId',
            base: 'CITY'
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
        this.axios.post('/tmsOrgInfo/queryListByPage', data).then(res => {
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
        let title = '新增组织机构';
        if('edit' == todo) {
          title = '编辑组织机构'
        } else if ('view' == todo) {
          title = '查看组织机构'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '600px',
            height: '300px',
            title: title,
            url: '/base/temp/group_det.vue',
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
          this.axios.post('/tmsOrgInfo/delete', {id: row.id}).then(res => {
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
