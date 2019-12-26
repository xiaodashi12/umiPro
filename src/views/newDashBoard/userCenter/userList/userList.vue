<template>
  <div class="app-container">
    <div>
        <el-form :inline="true">
            <el-form-item label="员工编号">
                <el-input
                v-model="userInfo.ptId"
                placeholder="请输入员工编号"
                clearable
                size="small"
                @blur="handleEvent($event,1)"
                />
            </el-form-item>
            <el-form-item label="员工名称">
                <el-input
                    placeholder="请输入员工名称"
                    size="small"
                    clearable
                    v-model="userInfo.ptName"
                    @blur="handleEvent($event,2)"
                />
            </el-form-item>
            <el-form-item label="网点编号">
                <el-input
                    placeholder="请输入网点编号"
                    size="small"
                    clearable
                    v-model="userInfo.branchNo"
                    @blur="handleEvent($event,2)"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="serachData">搜索</el-button>               
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addNewUser">新增</el-button>
            </el-form-item>
            </el-form>

            <el-table
            v-loading="loading"
            :data="tableData"
            >
            <el-table-column fixed prop="opId" label="员工编号" sortable></el-table-column>
            <el-table-column prop="opName" label="员工名称" align="center">
            </el-table-column>
            <el-table-column prop="branchNo" label="网点编号" sortable></el-table-column>
            <el-table-column prop="branchName" label="网点名称"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="danger"  size="mini" icon="el-icon-refresh" @click="handlepwd(scope.row)">密码重置</el-button>
                    <el-button type="primary"  size="mini" @click="handleRole(scope.row)">配置角色</el-button>
                </template>
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
    <div>
        <el-dialog
        title="新增用户"
        :visible.sync="dialogVisible"
        width="800px"
        :before-close="handleClose">
            <el-form :model="form" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio-group v-model="form.gender">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="年龄">
                            <el-input v-model="form.age"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作">
                            <el-select v-model="form.job" clearable placeholder="请选择职业">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="年龄">
                            <el-input v-model="form.age"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作">
                            <el-select v-model="form.job" clearable placeholder="请选择职业">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ensureData()" style="margin-left:40px !important;">确 定</el-button>
            </span>
        </el-dialog>
         <el-dialog
            title="权限修改"
            close-on-click-modal
            :visible.sync="auditLogVisible"
            width="640px"
            :before-close="auditClose">
            <div style="background-color:#fff;height:420px;overflow-y: auto;">
                <el-row>
                    <el-col :span="10">
                    
                    <el-table
                        :data="hasOwnData"
                        border
                        height="380"
                        v-loading="loading"
                        style="width: 100%;margin-bottom: 0px"
                        @selection-change="handleSelectionChange">
                        
                        <el-table-column label="已拥有角色">
                            <el-table-column
                            type="selection"
                            width="40">
                            </el-table-column>
                            <el-table-column v-for="(item, key) in tableKey"
                                            :key="key"
                                            :prop="item.value"
                                            :label="item.name"
                                            :width="item.width"
                                            :formatter="tableFormatter"
                                            show-overflow-tooltip
                            >
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                    </el-col>

                    <el-col :span="4">
                    <div style="margin-top: 100%;margin-left:25%;margin-right:25%">
                        <!-- <el-button @click="selectItems">获取选中数据</el-button> -->
                        <el-button type="primary" @click="selectItems" icon="icon el-icon-d-arrow-right"></el-button>
                    </div>
                    </el-col>

                    <el-col :span="10">
                    <el-table
                        :data="resultData"
                        height="380"
                        style="width: 100%;margin-bottom: 0px"
                        border
                        >
                        <el-table-column label="未拥有角色">
                            <el-table-column v-for="(item, key) in tableKey"
                                            :key="key"
                                            :prop="item.value"
                                            :label="item.name"
                                            :width="item.width"
                                            :formatter="tableFormatter"
                                            show-overflow-tooltip
                            >
                                
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click.native.prevent="handleDelete(scope.$index, scope.row,resultData)">转移数据</el-button>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        
                    </el-table>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken} from '@/utils/auth';
import {platePadFloorMap} from '@/utils/dictionaries';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
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