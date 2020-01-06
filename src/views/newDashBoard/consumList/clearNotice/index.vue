<template>
    <div class='app-container'>
        <div class="serachTitle" style="">
            <el-row :gutter="24" style="width:100%;">
                
                <el-col :span="21" style="display:flex;align-items:center;">
                    <div>
                        <!-- <el-date-picker
                        v-model="auditData.beginDate"
                        type="date"
                        size="mini"
                        @change="changeBeginDate"
                        placeholder="选择日期">
                        </el-date-picker>
                        -- -->
                        <el-date-picker
                        v-model="auditData.endDate"
                        type="date"
                        size="mini"
                            @change="changeEndDate"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="showDataList">搜索</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
            :summary-method="getSummaries"
            show-summary
            v-loading="loading"
            :data="tableData"
            class="titleVal"
            id="table"
            >

            <el-table-column align="center" prop="titled" :label="titled">
                <el-table-column fixed prop="name" label="清分方" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{platePadStatusFloorMap.get(scope.row.status)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="清分合计" align="center">
                    <el-table-column prop="cnt" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="amount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.amount/100}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="正常交易" align="center">
                    <el-table-column prop="normalCnt" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="normalAmount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.normalAmount/100}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="争议支付" align="center">
                    <el-table-column prop="disputeAcceptCount" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="disputeAcceptAmount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.disputeAcceptAmount/100}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="争议拒付" align="center">
                    <el-table-column prop="disputeDenyCount" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="disputeDenyAmount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.disputeDenyAmount/100}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="退费交易" align="center">
                    <el-table-column prop="refundCount" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="refundAmount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.refundAmount/100}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="补交" align="center">
                    <el-table-column prop="restitutionCount" label="条数" align="center">
                    </el-table-column>
                    <el-table-column prop="restitutionAmount" label="金额" align="center">
                        <template slot-scope="scope">
                            {{scope.row.restitutionAmount/100}}
                        </template>
                    </el-table-column>
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
import {platePadFloorMap,platePadStatusFloorMap} from '@/utils/dictionaries';
import axios from 'axios'
import {dateToString,tsmDateToString} from '@/utils/utils'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            platePadStatusFloorMap,
            titleVal:'0',
            titled:'清分通知书',
            titleLabel:[],
            // 遮罩层
            loading: true,
            headerTitle:['渠道','应发数据','实际发送','未发送','银行','未响应数','退款'],
            searchIdx:'',
            options:[],
            valueType: '',
            inputVal:'',
            optionsInfo: [],
            values:'',
            screenHeight: 520,
            areaValue:'',
            pageIndexed:1,
            total:0,
            bankData:[],
            auditData:{
                beginDate : "",
                endDate :"",
            },
            tableData: [],
            // tableData:[
            //     {
            //         "name": "省内",
            //         "cnt": 2,
            //         "amount": 11000,
            //         "normalCnt": 2,
            //         "normalAmount": 11000,
            //         "disputeAcceptCount": 0,
            //         "disputeAcceptAmount": 0,
            //         "disputeDenyCount": 0,
            //         "disputeDenyAmount": 0,
            //         "refundCount": 0,
            //         "refundAmount": 0,
            //         "restitutionCount": 0,
            //         "restitutionAmount": 0,
            //         "status": 1
            //     },
            //     {
            //         "name": "省外",
            //         "cnt": 2,
            //         "amount": 100300,
            //         "normalCnt": 2,
            //         "normalAmount": 100300,
            //         "disputeAcceptCount": 0,
            //         "disputeAcceptAmount": 0,
            //         "disputeDenyCount": 0,
            //         "disputeDenyAmount": 0,
            //         "refundCount": 0,
            //         "refundAmount": 0,
            //         "restitutionCount": 0,
            //         "restitutionAmount": 0,
            //         "status": 1
            //     }
            // ],
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=640;
        }
        this.screenHeight=document.body.clientHeight-180;
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
            XLSX.writeFile(workbooked, '银行联名记账卡消费场景汇总月报表.xlsx');
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
                // debugger
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
                    if(index%2==0 && index!=0){
                        sums[index]=sums[index]/100;
                    }else if(index==0){
                        sums[index]='合计';
                    }else if(index==1){
                        sums[index]='';
                    }else{
                        sums[index];
                    }
                    
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
            // this.loading=false;
            let params = {
                url: api['queryClear'].url,
                method: 'post',
                data: {
                    startDate:this.auditData.endDate.replace(/-/g, "")
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                this.tableData = res.data;
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
        },
    }
}
 </script>
<style lang="scss">

    .el-table td.is-hidden > * {
        visibility: visible !important;
    } 

    .taskTitle{
        height: 40px;
        line-height: 40px;
        text-align: center;
    }    
 </style>