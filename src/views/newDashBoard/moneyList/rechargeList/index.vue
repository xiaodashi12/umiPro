<template>
    <div class='ect-page'>
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;">
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
                <el-col :span="5" style="margin-left:20px;">
                    <div class="grid-content bg-purple-light ect-input">
                        <el-button type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                        <el-button type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:60px;">
            <div>
                <el-table 
                :data="tableData" 
                stripe 
                border 
                style="width: 100%" 
                :height="screenHeight"
                :summary-method="getSummaries"
                show-summary  
                id="table">
                    <el-table-column prop="branchName" label="网点名称" min-width="5%">
                    </el-table-column>
                    <el-table-column prop="branchNo" label="网点编号" min-width="5%">
                    </el-table-column>
                    <el-table-column prop="count" label="数量" min-width="10%" >
                    </el-table-column>
                    <el-table-column prop="money" label="充值钱数" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="payChannel" label="充值方式" min-width="10%">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ platePayTypeMap.get(scope.row.payChannel)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50,100,200]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div> -->
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
            form:{
                name:'',
                age:'',
                gender:'',
                job:''
            },
            platePayTypeMap,
            dialogVisible:false,
            screenHeight: 430,
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
            
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=520;
        }
        this.auditData.endDate=tsmDateToString(new Date());
        this.auditData.beginDate=tsmDateToString(new Date().getTime()-7*24*60*60*1000);
        debugger
        this.showDataList();
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
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, 'text.xlsx');
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
                url: api['branchReport'].url,
                method: 'post',
                data: {
                    startDate:this.auditData.beginDate,
                    endDate:this.auditData.endDate,
                    pageIndex: this.pageIndexed,
                    pageSize: this.pageSized
                }
            }
            this.startLoading();
            fetch(params).then(res => {
                this.tableData = res.data;
                this.endLoading();
            }).catch(error => {
                this.endLoading()
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
        width: 100%;
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>