<template>
    <div class="app-container">
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;" class="speSearch">
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
                <span style="margin-left:10px;">卡类型：</span>
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
        <div style="margin-top:60px;" class="specialTable">
            <div>
                <el-table 
                :data="tableData.slice((pageIndexed-1)*pageSized,pageIndexed*pageSized)" 
                stripe 
                border 
                :height="screenHeight"
                v-loading="loading"
                id="table">
                    
                    <el-table-column prop="sellScheme" label="销售方案名称" align="center">
                    </el-table-column>
                    <el-table-column prop="customerName" label="客户名称" align="center">
                    </el-table-column>
                    <el-table-column prop="opName" label="用户名称" align="center">
                    </el-table-column>
                    <el-table-column prop="branchName" label="网点名称" align="center">
                    </el-table-column>
                    <el-table-column prop="cardId" label="卡号" align="center">
                    </el-table-column>
                    <el-table-column prop="licensePlate" label="车牌号" align="center">
                    </el-table-column>
                    <el-table-column prop="licenseColor" label="车牌颜色" align="center">
                        <template slot-scope="scope">
                            <span>{{plateColorToColorMap.get(scope.row.licenseColor)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="卡类型" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.type==1 ? 'CPU' : 'OBU'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
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
    </div>
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import {dateToString,tsmDateToString} from '@/utils/utils'
import {platePayTypeMap,plateChoStatusFloorMap,plateColorToColorMap} from '@/utils/dictionaries'
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            plateChoStatusFloorMap,
            plateColorToColorMap,
            choVal:'1',
            choOptions: [{
                value: '1',
                label: 'CPU'
            },{
                value: '2',
                label: 'OBU'
            }],
            value: '',
            loading:true,
            form:{
                name:'',
                age:'',
                gender:'',
                job:''
            },
            platePayTypeMap,
            dialogVisible:false,
            screenHeight: 460,
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
                endDate :"",
                status:'-1',
                equilibriumStatus:'-1',
                branchNo:'',
                operatorId:'',
                cpuCardId:'',
                licenseCode:''
            },
            
        }
    },
    created(){
        // if(document.body.clientHeight>700){
        //     this.screenHeight=550;
        // }
        this.screenHeight=document.body.clientHeight-220;
        this.auditData.endDate=tsmDateToString(new Date());
        this.auditData.beginDate=tsmDateToString(new Date().getTime()-7*24*60*60*1000);
        this.showDataList();
    },
    filters:{
        formatDate: function (time) {
            var re = /-?\d+/
            var m = re.exec(time)
            var d = new Date(parseInt(m[0]))
            var o = {
                'M+': d.getMonth() + 1,
                'd+': d.getDate(),
                'h+': d.getHours(),
                'm+': d.getMinutes(),
                's+': d.getSeconds(),
                'q+': Math.floor((d.getMonth() + 3) / 3),
                'S': d.getMilliseconds()
            }
            var format = 'yyyy-MM-dd mm:ss'
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
                }
            }
            return format
            }
    },
    methods: {
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '销售明细报表.xlsx');
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
                url: api['sellReportDetailForBranch'].url,
                method: 'post',
                data: {
                    startDate:this.auditData.beginDate.replace(/-/g,''),
                    endDate:this.auditData.endDate.replace(/-/g,''),
                    type:this.choVal
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                if(res.data){
                    this.tableData = res.data;
                    this.total=this.tableData.length;
                }
                
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
    .speSearch{
        .el-input{
            width:160px !important;
        }
    }
</style>