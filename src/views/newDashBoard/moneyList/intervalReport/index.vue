<template>
    <div class='ect-page'>
        <div class="serachTitle" style="">
            <el-row :gutter="24" style="width:100%;">
                <el-col :span="3" class="taskTitle">
                    <div>
                        银行列表
                    </div>
                </el-col>
                <el-col :span="21" style="display:flex;align-items:center;">
                    <div>
                        <el-date-picker
                        v-model="auditData.beginDate"
                        type="date"
                        @change="changeBeginDate"
                        placeholder="选择日期">
                        </el-date-picker>
                        --
                        <el-date-picker
                        v-model="auditData.endDate"
                        type="date"
                         @change="changeEndDate"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <el-button icon="el-icon-search" @click="serachData"></el-button>
                    <el-button type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                :summary-method="getSummaries"
                show-summary
                border
                id="table"
                style="width: 100%; margin-top: 20px">
                    <el-table-column 
                        label="银行绑定记账卡结算情况区间报表"
                        align="center">
                        <el-table-column
                            prop="name"
                            label="类型"
                            align="center"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            align="center"
                            label="消费场景">
                        </el-table-column>
                        
                        <el-table-column
                            align="center"
                            prop="shoulData"
                            label="日期">
                        </el-table-column>
                        <el-table-column
                            prop="newData"
                            align="center"
                            label="已发送金额">
                        </el-table-column>
                        <el-table-column
                            prop="noData"
                            align="center"
                            label="已清分金额">
                        </el-table-column>
                        <el-table-column
                            prop="bankData"
                            align="center"
                            label="未响应金额">
                        </el-table-column>
                        <el-table-column
                            prop="noInData"
                            align="center"
                            label="封账">
                        </el-table-column>
                        <el-table-column
                            prop="noMoney"
                            align="center"
                            label="实际入账">
                        </el-table-column>
                        <el-table-column
                            prop="noMoney"
                            align="center"
                            label="入账差异">
                        </el-table-column>
                    </el-table-column>
                    
                </el-table>
        </div>  
    </div>
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken,getLocalStorage} from '@/utils/auth';
import axios from 'axios'
import {dateToString,tsmDateToString} from '@/utils/utils'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            headerTitle:[],
            searchIdx:'',
            options:[],
            valueType: '',
            inputVal:'',
            optionsInfo: [],
            values:'',
            screenHeight: 500,
            areaValue:'',
            pageIndexed:1,
            total:0,
            bankData:[],
            auditData:{
                beginDate : "",
                endDate :"",
            },
            tableData: [

                    {
                            id: 1,
                            date: '2016-05-01',
                            name: '工行',
                            type:'分对分',
                            shoulData: 11,
                            newData: 12,
                            noData: 13,
                            bankData: 14,
                            noInData: 15,
                            noMoney: 16,
                    }, {
                        id: 1,
                        date: '2016-05-01',
                        type:'部中心',
                        shoulData: 211,
                        newData: 212,
                        noData: 213,
                        bankData: 214,
                        noInData: 215,
                        noMoney: 216,
                    }, {
                        id: 1,
                        date: '2016-05-01',
                        name: '工行',
                        type:'小计',
                        shoulData: 311,
                        newData: 312,
                        noData: 313,
                        bankData: 314,
                        noInData: 315,
                        noMoney: 316,
                    },
                    {
                            id: 2,
                            date: '2019-05-01',
                            name: '建行',
                            type:'分对分',
                            shoulData: 411,
                            newData: 412,
                            noData: 413,
                            bankData: 414,
                            noInData: 415,
                            noMoney: 416,
                        }, {
                            id: 2,
                            date: '2019-05-01',
                            name: '建行',
                            type:'部中心',
                            shoulData: 511,
                            newData: 512,
                            noData: 513,
                            bankData: 514,
                            noInData: 515,
                            noMoney: 516,
                        }, {
                            id: 2,
                            date: '2019-05-01',
                            name: '建行',
                            type:'小计',
                            shoulData: 611,
                            newData: 612,
                            noData: 613,
                            bankData: 614,
                            noInData: 615,
                            noMoney: 616,
                        }
            ] 
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
    mounted(){
        
    },
    methods:{
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '银行列表.xlsx');
        },
         objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //  debugger
            if (columnIndex === 0) {
                if (rowIndex % 3 === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                }else{
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
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
        serachData(){
            
        },
        changeBeginDate(val){
            console.log(val)
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            console.log(val)
            this.auditData.endDate=tsmDateToString(val)
        },
        showDataList(){

        },
    }
}
 </script>
<style lang="scss" scoped>
    .taskTitle{
        height: 40px;
        line-height: 40px;
        text-align: center;
    }    
 </style>