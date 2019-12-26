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
                <el-table class="tb-edit" highlight-current-row :data="tableData" style="width: 100%">
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
                { label: "节点编号", prop: "node", type: "normal" },
                { label: "名称", prop: "name", type: "normal" },
                { label: "类型", prop: "type", type: "sort" },
                { label: "坐标", prop: "coordinate", type: "normal" }
            ],
            tableData: [
                {
                    node: "0051",
                    name: " 机库顶",
                    type: "UWB",
                    status: "正常",
                    coordinate: "12.21,34.45,34.6"
                },
                {
                    node: "0061",
                    name: "机库门",
                    type: "GPS",
                    status: "低电",
                    coordinate: "45.41,67.45,78.6"
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
            contentSpanArr: [],
            idArr:[],
            idPos: 0
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
            if (columnIndex === 0) {
                const row1 = this.idArr[rowIndex]
                const col1 = row1 > 0 ? 1 : 0
                return {
                    rowspan: row1,
                    colspan: col1
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
            XLSX.writeFile(workbooked, '自营网点资金对账.xlsx');
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
            this.idArr = []
            this.idPos = 0
            for (let i = 0; i < this.tableData.length; i++) {
                if (i === 0) {
                    this.idArr.push(1)
                    this.idPos = 0
                } else {
                    if (this.tableData[i].id === this.tableData[i - 1].id) {
                        this.idArr[this.idPos] += 1
                        this.idArr.push(0)
                    } else {
                        this.idArr.push(1)
                        this.idPos = i
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