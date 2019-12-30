<template>
    <div class='app-container'>
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;">
                <el-date-picker
                v-model="auditData.beginDate"
                type="date"
                 size="mini"
                @change="changeBeginDate"
                placeholder="选择日期">
                </el-date-picker>
                --
                <el-date-picker
                 size="mini"
                v-model="auditData.endDate"
                type="date"
                    @change="changeEndDate"
                placeholder="选择日期">
                </el-date-picker>
                <el-col :span="5" style="margin-left:20px;">
                    <div class="grid-content bg-purple-light ect-input">
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:60px;">
            <div style="height: calc(100% - 160px);width: 100%;overflow-y: scroll;position: absolute;">
                <el-table 
                :span-method="objectSpanMethod"
                class="tb-edit" 
                highlight-current-row 
                :data="tableData" 
                id="table"
                style="width: 100%">
                    <template v-for="(col,index) in cols">
                        <el-table-column v-bind:key="index" :prop="col.prop" :label="col.label">
                        </el-table-column>
                        <!-- <el-table-column v-bind:key="index" v-if="col.type==='sort'" :prop="col.prop" sortable :label="col.label">
                            <template slot-scope="scope">
                                <el-tag type="primary">{{ scope.row.type }}</el-tag>
                            </template>
                        </el-table-column> -->
                    </template>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import {dateToString,tsmDateToString} from '@/utils/utils'
import {platePayTypeMap} from '@/utils/dictionaries'
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            cols: [
                { label: "节点类别", prop: "node", type: "normal" },
                { label: "节点名称", prop: "name", type: "normal" },
                { label: "节点方式", prop: "type", type: "normal" },
                { label: "节点金额", prop: "coordinate", type: "normal" },
                { label: "钱1", prop: "money", type: "normal" },
                { label: "钱2", prop: "money", type: "normal" },
                { label: "钱3", prop: "money2", type: "normal" },
                { label: "钱4", prop: "money3", type: "normal" },
            ],
            tableData: [
                {
                    id:1,
                    ids:2,
                    idz:1,
                    node: "资金来源",
                    name: " 苏通卡充值",
                    type: "POS",
                    status: "正常",
                    coordinate: "金额",
                    money:111,
                    money1:112,
                    money2:113,
                    money3:114,
                },
                {
                    id:1,
                    ids:2,
                    idz:2,
                    node: "资金来源",
                    name: "苏通卡充值",
                    type: "微信扫码",
                    status: "低电",
                    coordinate: "金额",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:1,
                    ids:2,
                    idz:3,
                    node: "资金来源",
                    name: "苏通卡充值",
                    type: "现金",
                    status: "低电",
                    coordinate: "金额",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:1,
                    idz:4,
                    node: "套餐情况",
                    name: "记账卡",
                    type: "你好",
                    status: "低电",
                    coordinate: "金额",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:1,
                    idz:4,
                    node: "套餐情况",
                    name: "记账卡",
                    type: "你好",
                    status: "低电",
                    coordinate: "数量",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:1,
                    idz:2,
                    node: "套餐情况",
                    name: "记账卡",
                    type: "GPS",
                    status: "低电",
                    coordinate: "金额",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:1,
                    idz:2,
                    node: "套餐情况",
                    name: "记账卡",
                    type: "GPS",
                    status: "低电",
                    coordinate: "数量",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:2,
                    idz:3,
                    node: "套餐情况",
                    name: "网单补发",
                    type: "GPS",
                    status: "低电",
                    coordinate: "金额",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                },
                {
                    id:2,
                    ids:2,
                    idz:3,
                    node: "套餐情况",
                    name: "网单补发",
                    type: "GPS",
                    status: "低电",
                    coordinate: "数量",
                    money:211,
                    money1:212,
                    money2:213,
                    money3:214,
                }
            ],
            // 遮罩层
            loading: true,
            platePayTypeMap,
            dialogVisible:false,
            screenHeight: 430,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            total:0,
            auditData:{
                beginDate : "",
                endDate :""
            },
            spanArr: [], // 一个空的数组，用于存放每一行记录的合并数
            pos: 0, // spanArr 的索引
            posT: 0, // spanArr 的索引
            contentSpanArr: [],
            ownSpanArr:[],
            position: 0,
            rowAndColumn:[],
            rowRoomColumn:[],
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=520;
        }
        this.auditData.endDate=tsmDateToString(new Date());
        this.auditData.beginDate=tsmDateToString(new Date().getTime()-7*24*60*60*1000);
        this.showDataList();
    },
    methods: {
        handleCurrentChange(row, event, column) {
            console.log(row, event, column, event.currentTarget);
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
         // 合并单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 ) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            } else if (columnIndex === 1) {
                const _row = this.contentSpanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            } else if (columnIndex === 2) {
                const _row = this.ownSpanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index];
                } else {
                    sums[index];
                }
            });

            return sums;
        },
        selectAreaChange(val){
            this.titled=this.titleLabel[val].label;           
        },
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '网点设备销售来源核对日表.xlsx');
        },
        handleClose(){
            
        },
        changeBeginDate(val){
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            this.auditData.endDate=tsmDateToString(val)
        },
       addNewUser(){
           this.dialogVisible=true;
       },
        handleSizeChange(val) {
            this.pageSized=val;
            this.showDataList();
            console.log(val);
        },
        handleCurrentChange(val) {
            this.pageIndexed=val;
            console.log(`当前页: ${val}`);
            this.showDataList();
        },
        serachData(){
            this.showDataList();
        },
        mergeData(){
            // 设定一个数组spanArr/contentSpanArr来存放要合并的格数，同时还要设定一个变量pos/position来记录
          this.spanArr = [];
          this.contentSpanArr = [];
          this.ownSpanArr = [];
          let data=this.tableData;
          for (var i = 0; i < data.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0;
              this.contentSpanArr.push(1);
              this.posT=0;
              this.ownSpanArr.push(1);
              this.position = 0;
            } else {
              // 判断当前元素与上一个元素是否相同(第1和第2列)
              if (data[i].id === data[i - 1].id) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
              if (data[i].ids === data[i - 1].ids) {
                this.contentSpanArr[this.posT] += 1;
                this.contentSpanArr.push(0);
              } else {
                this.contentSpanArr.push(1);
                this.posT = i;
              }
              debugger
              // 判断当前元素与上一个元素是否相同(第3列)
              if (data[i].idz === data[i - 1].idz) {
                this.ownSpanArr[this.position] += 1;
                this.ownSpanArr.push(0);
              } else {
                this.ownSpanArr.push(1);
                this.position = i;
              }
            }
          }
        },
        showDataList(){
            this.loading = false;
            this.mergeData();
            // let params = {
            //     url: api['onwerReport'].url,
            //     method: 'post',
            //     data: {
            //         startDate:this.auditData.beginDate,
            //         endDate:this.auditData.endDate,
            //         pageIndex: this.pageIndexed,
            //         pageSize: this.pageSized
            //     }
            // }
            // this.loading = true;
            // fetch(params).then(res => {
            //     this.tableData = res.data;
            //     this.loading = false;
            // }).catch(error => {
            //     this.loading = false;
            //     this.$msgbox({
            //         message:  error.message,
            //         title: '失败',
            //         customClass: 'my_msgBox singelBtn',
            //         dangerouslyUseHTMLString: true,
            //         confirmButtonText: '确定',
            //         type: 'error'
            //     })
            // })
        }
    },
}
</script>

<style lang="scss" scoped>
    .etc-col{
        text-align: center;
    }
    .ect-page{
        height: 90%;
        position: absolute;
        width: 82%;
        padding:10px;
        // overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>