<template>
    <div class='ect-page'>
        <div class="serachTitle" style="">
            <el-row :gutter="24" style="width:100%;">
                <el-col :span="3">
                    <div class="taskTitle">
                        区间列表
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
                </el-col>
            </el-row>
        </div>  
        <div style="background-color:#fff;height: 74%;">
                <el-table 
                :data="bankData" 
                :summary-method="getSummaries"
                show-summary
                style="width: 100%;height:100%;overflow-y: auto;" >
                        <el-table-column
                            prop="name"
                            label="渠道名称"
                            min-width="10%" align="center">
                        </el-table-column>
                        <el-table-column label="消费情况" align="center">
                            <el-table-column
                                prop="pushNum"
                                min-width="10%"
                                label="省内消费" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="abnormalNum"
                                label="省外消费"
                                min-width="10%" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="abnormalRate"
                                label="争议支付"
                                min-width="10%" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="abnormalRate"
                                label="退费金额"
                                min-width="10%" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="abnormalRate"
                                label="补交金额"
                                min-width="10%" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="abnormalRate"
                                label="总金额"
                                min-width="10%" align="center">
                            </el-table-column>
                        </el-table-column>
                </el-table>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken,getLocalStorage} from '@/utils/auth';
import axios from 'axios'
import {dateToString,tsmDateToString} from '@/utils/utils'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            searchIdx:'',
            options:[],
            valueType: '',
            inputVal:'',
            optionsInfo: [],
            values:'',
            screenHeight: 500,
            areaValue:'',
            pageIndexed:1,
            tableData: [],
            total:0,
            bankData:[],
            auditData:{
                beginDate : "",
                endDate :"",
            }, 
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
    methods: {
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
        
        changeBeginDate(val){
            console.log(val)
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            console.log(val)
            this.auditData.endDate=tsmDateToString(val)
        },
        searchData(){
             this.showDataList();
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            // this.startLoading();
            // let params = {
            //     url: api['getStatisticResult'].url,
            //     method: 'get',
            //     params: {
            //         beginDate : this.auditData.beginDate,
            //         endDate :this.auditData.endDate,
            //     }
            // }
            // fetch(params).then(res => {
            //     if(res.data){
            //         this.bankData=res.data;
            //     }
            //     this.endLoading();
            // }).catch(error => {
            //     this.endLoading()
            //     console.log(error)
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

<style lang="scss">
    .block{
        height:40px;
        background-color: #fff;
    }
    .marginDiv{
        margin-top:6px;
    }
    .el-divider{
        background-color: #000;
    }
    .gutterRow{
        margin:10px 0 !important;
        padding:10px;
        border-bottom:1px solid #bababa;
    }
    .el-button + .el-button{
        margin:0px !important;
    }
    .el-input__inner{
        height:32px !important;
        line-height: 32px !important;
    }
    .el-button{
        padding:8px 10px;
    }
    .etc-col{
        text-align: center;
    }
    .taskTitle{
        font-size:16px;
        margin-left: 32px;
    }
    .ect-page{
        height: 96%;
        position: absolute;
        width: 100%;
        overflow-y: scroll;
        padding:0 10px;
        box-sizing:border-box;
        position: relative;
        .serachTitle{
            position:relative;
            z-index:999;
            width:100%;
            background-color:#eee;
            height: 58px;
            display:flex;
            align-items: center;
        
        }
    }
    .ect-input{
        margin:10px 0;
    }
    .el-input__inner{
        margin:0px !important;
    }
    .carLienseColor{
        letter-spacing: 2px;
        width:120px;
        height:46px;
        font-size: 16px;
        display:flex;
        align-items: center;
        justify-content: center;
    }
</style>