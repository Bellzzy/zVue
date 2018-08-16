<!-- 内部车辆运力 -->
<template>
  <div class="main">
    <div class="main-search" v-split>
      <div class="main-search__title">内部车辆运力信息</div>    
       <cc-search :cols='searchCols' :data='search'>
        <template slot='mileage'>
              <el-input v-model='search.startMileage' class='min'></el-input>
              ~
              <el-input v-model='search.endMileage' class='min'></el-input>
          </template>
          <div slot='capacityDate'>
            <div class="item dateClass">
              <label>商业险到期日期</label>
              <el-date-picker v-model="search.businessDate" type="daterange" :editable='false' 
              :value-format='"yyyy-MM-dd"' start-placeholder="开始日期" end-placeholder="结束日期" 
              range-separator="-" ></el-date-picker>
            </div>
             <div class="item dateClass">
                <label>下次年审日期</label>
                <el-date-picker v-model="search.trialDate" type="daterange" :editable='false' 
                :value-format='"yyyy-MM-dd"' start-placeholder="开始日期" end-placeholder="结束日期" 
                range-separator="-" ></el-date-picker>
            </div>
            <div class="item dateClass">
                <label>交强险到期日期</label>
                <el-date-picker v-model="search.overDate" type="daterange" :editable='false' 
                :value-format='"yyyy-MM-dd"' start-placeholder="开始日期" end-placeholder="结束日期" 
                range-separator="-" ></el-date-picker>
            </div>
             <div class='opt' slot='opt'>
                <el-button type='primary' @click='getData' :disabled='onQuery' :loading='onQuery'>查询</el-button>
                <el-button type='primary' @click='reset'>重置</el-button>
            </div>
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
      </template>
    </cc-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: {
          plate: '',
          brand: '',
          orgId: '',
          energyType: '',
          model: '',
          startMileage: '',
          endMileage: '',
          businessDate: [new Date('startBusinessDate'),new Date('endBusinessDate')],
          trialDate: [new Date('startTrialDate'), new Date('endTrialDate')],
          overDate: [new Date('startOverDate'), new Date('endOverDate')]
        },
        searchCols: [
          {
            label: '车牌号',
            input: true,
            prop: 'plate'
          },{
            label: '所属分公司',
            base: 'COMPANY',
            prop: 'orgId'
          },{
            label: '车型',
            prop: 'model',
            dic: 'MODEL'
          },{
            label: '最大行驶里程',
            slot: 'mileage'
          },{
            label: '租赁公司',
            prop: 'operateCur',
            base: 'LEASING'
          }
        ],
        dataList: [{}],
        cols: [
          {
            label: '车牌号',
            prop: 'plate'
          },{
            label: '所属公司',
            prop: 'orgId',
            base: 'COMPANY'
          }, {
            label: '品牌型号',
            prop: 'brand'
          }, {
            label: '车型',
            prop: 'model',
            dic: 'MODEL'
          },{
          	label: '最大行驶里程（km）',
            width: 135,
         	  prop: 'mileage'
          },{
            label: '下次年审日期',
            width: 100,
            prop: 'trialDate'
          },{
            label: '租赁起始日期',
            width: 100,
            prop: 'leaseStartDate'
          },{
            label: '租赁到期日期',
            width: 100,
            prop: 'leaseEndDate'
          },{
            label: '租赁公司',
            prop: 'operateCur',
            base: 'LEASING'
          },{
            label: '商业险购买日期',
            width: 110,
            prop: 'businessStartDate'
          },{
            label: '商业险到期日期',
            width: 110,
            prop: 'businessEndDate'
          },{
            label: '交强险购买日期',
            width: 110,
            prop: 'overStartDate'
          },{
            label: '交强险到期日期',
            width: 110,
            prop: 'overEndDate'
          },{
          	label: '最近保修日期',
            width: 100,
          	prop: 'guaranteeDate'
          },{
          	label: '车辆状态',
            dic: 'CARSTATUS',
          	prop: 'vehicleState'
          },{
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
        onImport: false,
        settings: {
          showOrderNo: true,
        }
      }
    },
    methods: {
      getData() {
        this.onQuery = true;
        let dateData = {
          startBusinessDate: this.search.businessDate[0],
          endBusinessDate: this.search.businessDate[1],
          startTrialDate: this.search.trialDate[0],
          endTrialDate: this.search.trialDate[1],
          startOverDate: this.search.overDate[0],
          endOverDate: this.search.overDate[1]
        }
        let data =Object.assign({}, this.search, this.query, dateData);
        this.axios.post('/capacityManager/queryVehicleInfoByPage', data).then(res => {
          if(200 == res.code) {
            this.dataList = res.data || [];
            this.total = res.count;
          }
          this.onQuery = false;
        }).catch(err => {
          this.onQuery = false;
        })
      },
      reset() {
        this.__reset(this.search)
      },
      alert(todo, row) {
        let title = '新增内部车辆信息';
        if('edit' == todo) {
          title = '编辑内部车辆信息'
        } else if ('view' == todo) {
          title = '查看内部车辆信息'
        }
        new Promise(resolve => {
          this.$emit('openAlert', {
            width: '1000px',
            height: '500px',
            title: title,
            url: '/capacity/temp/insidecar_det.vue',
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
.dateClass
  margin-right: 100px !important
.dateClass label
  width: 85px !important;
.main-search__body .item 
  width: 240px !important
</style>