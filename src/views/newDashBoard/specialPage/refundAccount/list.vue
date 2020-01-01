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
                 size="mini"
                v-model="auditData.endDate"
                type="date"
                    @change="changeEndDate"
                placeholder="选择日期">
                </el-date-picker>
                <el-col :span="5" style="margin-left:20px;">
                    <div class="grid-content bg-purple-light ect-input">
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                        <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="addData">新增</el-button> -->
                        <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    <div style="margin-top:60px;">
        <el-table
        v-loading="loading"
        :data="tableData"
        id="table"
        >
        <el-table-column prop="name" label="申请人姓名" align="center"></el-table-column>
        <el-table-column prop="licenseCode" label="车牌号" align="center">
        </el-table-column>
        <el-table-column prop="licenseColor" label="车牌颜色" align="center">
            <template slot-scope="scope">
                <span>{{plateColorToColorMap.get(scope.row.licenseColor+"")}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="hasCard" label="卡状态" align="center">
            <template slot-scope="scope">
                {{scope.row.hasCard==0 ? "无卡" : "有卡"}}
            </template>
        </el-table-column>
        <el-table-column prop="processStatus" label="流程状态" align="center">
            <template slot-scope="scope">
                {{procesStatusMap.get(scope.row.processStatus)}}
            </template>
        </el-table-column>
        <el-table-column prop="hasObu" label="是否存在OBU" align="center">
            <template slot-scope="scope">
                {{scope.row.hasObu==0 ? "否" : "是"}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center" fixed class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button type="primary"  size="mini" @click="handle(scope.row,0)">打开详情</el-button>
                <el-button type="primary"  icon="el-icon-edit" size="mini" @click="handle(scope.row,1)">编辑</el-button>
            </template>
        </el-table-column>
        </el-table>
    </div>
    
    <!-- <el-pagination
      v-show="total>0"
      :total="total"
      @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50,100,200]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->
    <el-dialog
        title="审核信息"
        :visible.sync="dialogVisible"
        width="960px"
        :before-close="handleClose">
        <refundAccount 
        :isControl="0"
        :passData="passData"
        :slideImg="slideImg"
        :isBeDisabled="isBeDisabled"
        @closeDialog="closeDialog"
        ></refundAccount>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import refundAccount from './index'
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken} from '@/utils/auth';
import {getImgUrl,tsmDateToString} from '@/utils/utils'
import {platePadFloorMap,plateColorToColorMap,procesStatusMap} from '@/utils/dictionaries';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    components:{refundAccount},
    data(){
        return{
            auditData:{
                beginDate : "",
                endDate :""
            },
            slideImg:[],
            passData:{},
            isBeDisabled:true,
            plateColorToColorMap,
            procesStatusMap,
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
        addData(){

        },
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '退款提交.xlsx');
        },
        changeBeginDate(val){
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            this.auditData.endDate=tsmDateToString(val)
        },
        closeDialog(){
            this.dialogVisible=false;
            this.showDataList();
        },  
        handleEvent(events){

        },
        handleClose(){
             this.dialogVisible=false;
             this.showDataList();
        },
        handle(row,idx){
            this.dialogVisible=true;
            this.isBeDisabled= idx==0 ? true : false;
            this.passData=row;
            const filesData=eval(this.passData.files);
            let picDataImg=[]
            for(let i=0;i<filesData.length;i++){
                if(filesData[i]){
                    let dataImage={};
                    dataImage["vcPicUrl"]=getImgUrl()+filesData[i];
                    picDataImg.push(dataImage);
                }
            }
            this.slideImg=picDataImg;
        },
        handleSelectionChange(val){
            this.chooseDataArr=val;
            
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
        handleClick(row) {
            console.log(row);
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            let params = {
                url: api['findList'].url,
                method: 'post',
                data: {
                    processStatus: '0'
                }
            }
            this.loading = true;
            fetch(params).then(res => {
                this.loading = false;
                this.tableData = res.data.data;
                this.total=res.data.total;
            }).catch(error => {
                this.loading = false;
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
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>
<style>
    .el-dialog__body{
        height:380px;
        padding:0px;
    }
</style>