<template>
    <div class='ect-page'>
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;">
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">员工编号：</label>
                </el-col>
                <el-col :span="3">   
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.ptId"
                            @blur="handleEvent($event,1)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">员工名称：</label>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.ptName"
                            @blur="handleEvent($event,2)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">网点编号：</label>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                             v-model="userInfo.branchNo"
                            @blur="handleEvent($event,3)"
                        />
                    </div>
                </el-col>
                <el-col :span="5" style="margin-left:20px;">
                    <div class="grid-content bg-purple-light ect-input">
                        <el-button type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                         <el-button type="primary" icon="el-icon-circle-plus" @click="addNewUser()">新增用户</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:60px;">
            <div>
                <el-table :data="tableData" stripe border style="width: 100%" :height="screenHeight">
                    <el-table-column fixed prop="opId" label="员工编号" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="opName" label="员工名称" width="200">
                    </el-table-column>
                    <el-table-column prop="branchNo" label="网点编号" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="branchName" label="网点名称" width="200">
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" icon="el-icon-refresh" @click="handlepwd(scope.row)">密码重置</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50,100,200]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
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
        </div>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
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
            }
            
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=520;
        }
        this.showDataList();
    },
    methods: {
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
            fetch(params).then(res => {
                this.endLoading();
                this.tableData = res.data.data;
                this.total=res.data.total;
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