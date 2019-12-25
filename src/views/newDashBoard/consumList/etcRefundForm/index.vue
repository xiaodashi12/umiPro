<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="员工编号">
        <el-date-picker
        v-model="auditData.beginDate"
        type="date"
        size="small"
        @change="changeBeginDate"
        placeholder="选择日期">
        </el-date-picker>
        
        --
        <el-date-picker
        v-model="auditData.endDate"
        type="date"
        size="small"
            @change="changeEndDate"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="serachData">搜索</el-button>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="exported">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      id="table"
    >
        <el-table-column label="ETC退费确认表" align="center">
            <el-table-column prop="name" label="服务方" width="100px" align="center"></el-table-column>
            <el-table-column prop="licenseCode" label="卡号" width="200px" align="center"></el-table-column>
            <el-table-column prop="licenseColor" label="开户人姓名" width="100px" align="center"></el-table-column>
            <el-table-column prop="hasCard" label="银行卡号" width="200px" align="center"></el-table-column>
            <el-table-column prop="processStatus" label="开户行" width="100px" align="center"></el-table-column>
            <el-table-column prop="hasObu" label="退费金额" width="100px" align="center"></el-table-column>
            <el-table-column prop="hasObu" label="调整类型" width="100px" align="center" fixed ></el-table-column>
            <el-table-column prop="name" label="争议处理结果时间" width="200px" align="center"></el-table-column>
            <el-table-column prop="licenseCode" label="清分目标日" width="200px" align="center"></el-table-column>
            <el-table-column prop="licenseColor" label="入口时间" width="200px" align="center"></el-table-column>
            <el-table-column prop="hasCard" label="出口时间" width="200px" align="center"></el-table-column>
            <el-table-column prop="processStatus" label="消费金额" width="100px" align="center"></el-table-column>
            <el-table-column prop="hasObu" label="行驶路径" width="200px" align="center"></el-table-column>
            <el-table-column prop="hasObu" label="车牌" width="100px" align="center" fixed ></el-table-column>
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
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken} from '@/utils/auth';
import {platePadFloorMap,plateColorToColorMap,procesStatusMap} from '@/utils/dictionaries';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    components:{},
    data(){
        return{
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
            auditData:{
                beginDate : "",
                endDate :""
            },
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
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, 'ETC退费确认表.xlsx');
        },
        closeDialog(){
            this.dialogVisible=false;
            this.showDataList();
        },  
        handleEvent(events){

        },
        handleClose(){
             this.dialogVisible=false;
        },
        handle(row,idx){
            this.dialogVisible=true;
            this.isBeDisabled= idx==0 ? true : false;
            this.passData=row;
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
            this.loading = false;
            // let params = {
            //     url: api['findList'].url,
            //     method: 'post',
            //     data: {
            //         processStatus: '0'
            //     }
            // }
            // this.loading = true;
            // fetch(params).then(res => {
            //     this.loading = false;
            //     this.tableData = res.data.data;
            //     this.total=res.data.total;
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