<template>
  <div class="app-container">
    <el-form :inline="true" class="titleVal">
      <el-form-item label="表格">
        <el-date-picker
        v-model="auditData.beginDate"
        type="date"
            size="mini"
        @change="changeBeginDate"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="表格">
        <el-date-picker
        v-model="auditData.endDate"
        type="date"
            size="mini"
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
    class="titleVal"
    id="table"
    :summary-method="getSummaries"
    show-summary
    >

    <el-table-column align="center" prop="titled" :label="titled">
        <el-table-column prop="allData" label="渠道名称" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="清分目标日" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="卡号" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="消费时间" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="金额" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="处理日期" align="center">
        </el-table-column>
        <el-table-column prop="allData" label="处理结果" align="center">
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
</template>
<script>
import XLSX from 'xlsx'
import api from '@/api'
import fetch from '@/utils/fetch'
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
            titled:'部中心消费退款报表',
            titleLabel:[
                {label:'苏州建行充值汇总表 （区间）',value:'0'},
                {label:'省建行充值汇总表（区间）',value:'1'},
                {label:'农信社充值汇总表（区间）',value:'2'},
                {label:'农行柜面充值汇总表（区间）',value:'3'},
                {label:'工行柜面充值汇总表（区间）',value:'4'},
                {label:'苏州光大柜面充值汇总表（区间）',value:'5'},
            ],
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
            XLSX.writeFile(workbooked, '圈存汇总报表.xlsx');
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
            console.log(row,"row")
            let arr=[];
            arr.push(row.id);
            let params = {
                url: api['updateUserRole'].url,
                method: 'post',
                data: {
                    roleIds:arr,
                    operatorId:this.operatorId,
                    type:1
                }
            }
            this.startLoading();
            fetch(params).then(res => {
                row['opId']=this.operatorId;
                this.handleRole(row);
                this.endLoading()
            }).catch(error => {
                this.endLoading()
            })
        },
        selectItems(){
            let arr=[];
            this.chooseDataArr.forEach((item,idx)=>{
                arr.push(item.id);
            })
            let params = {
                url: api['updateUserRole'].url,
                method: 'post',
                data: {
                    roleIds:arr,
                    operatorId:this.operatorId,
                    type:2
                }
            }
            this.loading = true;
            fetch(params).then(res => {
                let row={
                    opId:this.operatorId
                }
                // row['opId']=this.operatorId;
                // console.log(this.operatorId,"this.operatorId")
                this.handleRole(row);
                // this.endLoading()
                this.loading = false;
            }).catch(error => {
                this.loading = false;
            })
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
            console.log(event)
            switch(idx){
                case 1:
                    this.userInfo.opId=event.target.value
                    break;
                case 2:
                    this.userInfo.opName=event.target.value
                    break;
                case 3:
                    this.userInfo.branchNo=event.target.value
                    break;   
            }
        },
        handleClick(row) {
            console.log(row);
        },
        handleRole(row){
            console.log(row,"row");
             this.auditLogVisible=true;
             let params = {
                url: api['findUserRole'].url,
                method: 'post',
                data: {
                    operatorId:row.opId
                }
            }
            
            this.operatorId=row.opId;
            // this.generateData=[];
            this.loading = true;
            fetch(params).then(res => {
                let data=res.data;
                let arrOwnData=[];
                let arrData=[];
                data.forEach((item,idx)=>{
                    if(item.isOwn==0){
                        arrData.push(item)
                    }else if(item.isOwn==1){
                        arrOwnData.push(item)
                    }
                })
                this.hasOwnData=arrOwnData;
                this.resultData=arrData;
                this.loading = false;
            }).catch(error => {
                this.loading = false;
            })
        },
        handlepwd(row){
            this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(() => {
                let params = {
                    url: api['resetPwd'].url,
                    method: 'post',
                    data: {
                        newPassword: "",
                        opId: row.opId
                    }
                }
                fetch(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '重置密码成功!'
                    });
                }).catch(error => {
                    // this.endLoading()
                    this.$msgbox({
                        message:  error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
            
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            let params = {
                url: api['userList'].url,
                method: 'post',
                data: {
                    branchNo: this.userInfo.branchNo,
                    opName: this.userInfo.opName,
                    opId: this.userInfo.opId,
                    pageIndex: this.pageIndexed,
                    pageSize: this.pageSized
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