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
            <el-col :span="5">
                <div class="grid-content bg-purple-light ect-input" style="margin-left:10px;">
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
    <div style="margin-top:60px;">
        <el-table
        v-loading="loading"
        :data="tableData"
        class="titleVal"
        id="table"
        :summary-method="getSummaries"
        show-summary
        >

        <el-table-column align="center" prop="titled" :label="titled">
            <el-table-column fixed prop="tsTimesp" label="清分方" align="center"></el-table-column>
            <el-table-column label="清分合计" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="正常交易" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="争议支付" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="争议拒付" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="退费交易" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="补交" align="center">
                <el-table-column prop="allData" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="allData" label="金额" align="center">
                </el-table-column>
            </el-table-column>
        </el-table-column>
        
        </el-table>
        <el-pagination
        v-show="total>0"
        :total="total"
        @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50,100,200]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>
    
  </div>
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@/utils/fetch'
import {dateToString,tsmDateToString} from '@/utils/utils'
import {getToken} from '@/utils/auth';
import {platePadFloorMap} from '@/utils/dictionaries';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            auditData:{
                beginDate : "",
                endDate :""
            },
            titleVal:'0',
            titled:'清分通知书',
            titleLabel:[],
            // 遮罩层
            loading: true,
            hasOwnData:[],
            resultData:[],
            tableKey: [{
                name: '类型',
                value: 'type',
                label: 100
            },{
                name: '角色名称',
                value: 'name',
                label: 100
            }],
            platePadFloorMap,
            generateData: [],
            value: [1],
            value4: [1],
            valueModel:'',
            form:{
                name:'',
                age:'',
                gender:'',
                job:''
            },
             auditLogVisible:false,
            options: [{
                value: '0',
                label: '老师'
            }, {
                value: '1',
                label: '学生'
            }, {
                value: '2',
                label: '老师傅'
            }],
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
            operatorId:'',
            chooseDataArr:[]
        }
    },
    created(){
        // if(document.body.clientHeight>700){
        //     this.screenHeight=520;
        // }
        this.showDataList();
    },
    mounted(){
        // console.log(this.data+"#111111")
    },
    methods: {
        changeBeginDate(val){
            console.log(val)
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            console.log(val)
            this.auditData.endDate=tsmDateToString(val)
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
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '清分通知书.xlsx');
        },
        selectAreaChange(val){
            this.titled=this.titleLabel[val].label;
            
        },
        clickCommand(events){
            console.log(events)
        },
        tableFormatter(row, column, cellValue){
            if (column.property === 'type') {
                if(cellValue===0){
                    return '柜面'
                }else if(cellValue===1){
                    return 'PAD'
                }else if(cellValue===2){
                    return '管理后台'
                }
            }else{
                return cellValue 
            } 
        },
        handleDelete(idx,row,rowData){
            
        },
        selectItems(){
            
        },
        handleSelectionChange(val){
            this.chooseDataArr=val;
            
        },
        handleClose(){
            
        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },
        auditClose(){
            this.auditLogVisible=false;
        },
       addNewUser(){
           for(var key in this.form){
               this.form[key]="";
           }
           this.dialogVisible=true;
           
       },
       ensureData(){
           alert("是否点击确认按钮?")
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
        handleEvent(event,idx){
            
        },
        handleClick(row) {
            console.log(row);
        },
        handleRole(row){
            
        },
        handlepwd(row){
            
            
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            this.loading=false;
        }
    },
}
</script>

<style lang="scss">
    .el-dropdown-link {
        cursor: pointer;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .etc-col{
        text-align: center;
    }
    .ect-page{
        height: 90%;
        position: absolute;
        width: 82%;
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
    .titleVal{
        .el-input--mini .el-input__inner{
            width:300px
        }
    }
    
</style>