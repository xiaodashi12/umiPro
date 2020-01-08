<template>
    <div class="app-container">
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
                v-model="auditData.endDate"
                type="date"
                    size="mini"
                    @change="changeEndDate"
                placeholder="选择日期">
                </el-date-picker>
                <span style="margin-left:10px;">类型：</span>
                 <el-select size="small" v-model="choVal" placeholder="请选择">
                    <el-option
                    v-for="item in choOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-col :span="5">
                    <div class="grid-content bg-purple-light ect-input" style="margin-left:10px;">
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:60px;" class="speChong">
            <div>
                <el-table 
                :data="tableData" 
                stripe 
                border 
                :height="screenHeight"
                :span-method="objectSpanMethod"
                v-loading="loading"
                :summary-method="getSummaries"
                show-summary  
                id="table">
                    <el-table-column prop="nodeName" label="片区名称" align="center">
                    </el-table-column>
                    <el-table-column prop="branchName" label="网点名称" align="center">
                    </el-table-column>
                    <el-table-column label="小计" align="center">
                        <el-table-column prop="xiaoJiMoney" label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.xiaoJiMoney/100}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="xiaoJiCount" label="数量" align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="现金" align="center">
                        <el-table-column prop="cashMoney" label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.cashMoney/100}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="cashCount" label="数量" align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="POS机" align="center">
                        <el-table-column prop="posManey" label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.posManey/100}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="posCount" label="数量" align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="转账" align="center">
                        <el-table-column prop="changeMoney" label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.changeMoney/100}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeCount" label="数量" align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="微信扫码" align="center">
                        <el-table-column prop="thirdPayMoney" label="金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.thirdPayMoney/100}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="thirdCount" label="数量" align="center">
                        </el-table-column>
                    </el-table-column>
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
            loading:true,
            form:{
                name:'',
                age:'',
                gender:'',
                job:''
            },
            choVal:'1',
            choOptions: [{
                value: '1',
                label: '片区'
            },{
                value: '2',
                label: '银行'
            },{
                value: '3',
                label: '服务区'
            },{
                value: '4',
                label: '加油站'
            }],
            platePayTypeMap,
            dialogVisible:false,
            screenHeight: 490,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            tableData: [],
            total:0,
            userInfo:{
                branchNo:'',
                opName:'',
                opId:'',
            },
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
            this.screenHeight=580;
        }
        this.auditData.endDate=tsmDateToString(new Date());
        this.auditData.beginDate=tsmDateToString(new Date().getTime()-7*24*60*60*1000);
        this.showDataList();
    },
    methods: {
        // 合并单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 ) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            } 
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
              if (data[i].nodeId === data[i - 1].nodeId) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
          }
        },
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];

            columns.forEach((column, index) => {
                if (index == 0) {
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
                    if(index%2==0){
                        sums[index]=sums[index]/100;
                    }else{
                        sums[index];
                    }
                } else {
                    sums[index];
                }
            });

            return sums;
        },
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '充值报表.xlsx');
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
        showDataList(){
            let params = {
                url: api['rechargeAllReport'].url,
                method: 'post',
                data: {
                    startDate:this.auditData.beginDate,
                    endDate:this.auditData.endDate,
                    reportType:this.choVal
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                this.tableData = res.data;
                this.mergeData();
                this.loading=false;
            }).catch(error => {
                this.loading=false;
                this.$msgbox({
                    message:  error.message,
                    title: '失败',
                    customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    type: 'error'
                })
            })
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
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>
<style lang="scss">
.speChong{
    .el-table__footer-wrapper{
        margin-top:-38px;
    }
}
</style>