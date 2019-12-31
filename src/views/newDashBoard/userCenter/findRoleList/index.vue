<template>
    <div class='ect-page'>
            <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
                <el-row style="display:flex;align-items:center;">
                    <!-- <el-col :span="2" class="etc-col">
                        <label class="ect-input">类型：</label>
                    </el-col> -->
                    <el-col :span="5" style="margin-left:20px;">
                        <label class="ect-input">类型：</label>
                        <el-select  size="mini" v-model="optionVal" clearable placeholder="请选择类型">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" style="margin-left:20px;">
                        <div class="grid-content bg-purple-light ect-input">
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="serachData()">搜索</el-button>
                            <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addNewUser()">新增角色</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div style="margin-top:60px;">
                <el-table 
                :data="tableData" 
                stripe 
                border 
                v-loading="loading"
                style="width: 100%" 
                :height="screenHeight">
                    <el-table-column prop="id" label="id" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="名称" align="center">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" align="center">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ platePadFloorMap.get(scope.row.type)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status=='0'" style="margin-left: 10px">禁用</span>
                            <span v-else style="margin-left: 10px">正常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" icon="el-icon-s-order" @click="operateRow(scope.row)">操作</el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <el-dialog
                    title="权限修改"
                    close-on-click-modal
                    :visible.sync="auditLogVisible"
                    width="640px"
                    :before-close="auditClose">
                        <div style="background-color:#fff;height:420px;overflow-y: auto;">
                            <el-tree
                            :data="optionTree"
                            :props="defaultProps"
                            show-checkbox
                            ref="tree"
                            
                            @check-change="chooseNode"
                            node-key="id"
                            @check="chooseData"
                            :default-checked-keys="checkedKey">
                            </el-tree>
                        </div>
                    </el-dialog>
            </div>
            
            <el-dialog
            title="新增角色"
            close-on-click-modal
            :visible.sync="addUserVisible"
            width="640px"
            :before-close="addUserClose">
                <div style="background-color:#fff;height:200px;overflow-y: auto;">
                    <el-row>
                        <el-col :span="8">
                                <el-select v-model="userRole" clearable placeholder="请选择类型">
                                    <el-option
                                        v-for="item in optionRole"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-col>
                        <el-col :span="4" class="etc-col" style="display:flex;align-items:center;">
                            <label class="ect-input">角色名称</label>
                        </el-col>
                        <el-col :span="8">
                            <div style="margin-top: 0px;">
                                <el-input
                                    class="ect-input"
                                    v-model="roleName"
                                />
                            </div>
                        </el-col>
                    </el-row>
                    <span style="position:absolute;bottom:10px;right:10px;">
                        <el-button @click="addUserVisible = false">取 消</el-button>
                        <el-button type="primary" @click="ensureData()" style="margin-left:40px !important;">确 定</el-button>
                    </span>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import {dateToString,tsmDateToString,getDefaultKey} from '@/utils/utils'
import {platePayTypeMap,platePadFloorMap} from '@/utils/dictionaries'
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            loading:true,
            userRole:"",
            roleName:'',
            addUserVisible:false,
            auditLogVisible:false,
             optionProps: {
                value: 'id',
                label: 'name',
                children: 'children',
                checkStrictly:true
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            roleId:'',
            optionTree:[],
            checkedKey:[],
            options: [{
                value: '0',
                label: '柜面'
                }, {
                value: '1',
                label: 'PAD'
                }, {
                value: '2',
                label: '管理后台'
                }],
            optionRole: [{
                value: '0',
                label: '柜面'
                }, {
                value: '1',
                label: 'PAD'
                }, {
                value: '2',
                label: '管理后台'
                }],
                optionVal:'0',
            platePayTypeMap,
            platePadFloorMap,
            dialogVisible:false,
            screenHeight: 430,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            tableData: [],
            total:0,
            auditData:{
                beginDate : "",
                endDate :""
            },
            rowData:{}
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
        
        ensureData(){
             let params = {
                url: api['addRole'].url,
                method: 'post',
                data: {
                    name:this.roleName,
                    type:this.userRole
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                 this.loading=false;;
                 this.addUserVisible=false;
                 this.showDataList();
            }).catch(error => {
                this.loading=false;
            })
        },
        addNewUser(){
            this.userRole="";
            this.roleName='';
            this.addUserVisible=true;
           
        },
        bookEnsure(){
            
        },
        addUserClose(){
            this.addUserVisible=false;
        },
        auditClose(){
            this.auditLogVisible=false;
        },
        bookEnsure(){

        },
        operateRow(row){
            console.log(row,"row")
            this.rowData=row;
            this.getSysUserMenu(row.id);
            this.auditLogVisible=true;
        },
        getDefaultKey(data){
            console.log(this.rowData,"this.rowData")
            if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    if(data[i].status==1){ 
                        if(!(data[i].isParent) || (data[i].isParent && this.rowData.type!=2)){
                            this.checkedKey.push(data[i].id);
                        }
                        if(data[i].children && data[i].children.length>0){
                            this.getDefaultKey(data[i].children)
                        }
                    }else{
                        if(data[i].children && data[i].children.length>0){
                            this.getDefaultKey(data[i].children)
                        }
                    }
                }
            }
        },
        getSysUserMenu(id){
            let params = {
                url: api['sysUserMenu'].url,
                method: 'post',
                data: {
                    roleId:id
                }
            }
            this.roleId=id;
            this.optionTree=[];
            this.checkedKey=[];
            this.loading=true;
            fetch(params).then(res => {
                this.optionTree=res.data;
                this.getDefaultKey(this.optionTree)//被选中数据处理
                this.loading=false;
            }).catch(error => {
                this.loading=false;
            })
        },
        chooseData(val){
            // console.log(this.$refs.tree.getCheckedKeys())
            console.log(this.optionTree,"当前数据")
            console.log(val,"当前触发选中的数据")
            let chooseData=val;
            let typeVal=1;
            let arr=[];
            if(chooseData.isParent){
                if(chooseData.status==0){
                    chooseData['status']=1;
                    typeVal=1;
                    arr.push(chooseData.id);
                }else{
                    chooseData['status']=0;
                    typeVal=2;
                    arr.push(chooseData.id);
                }
                if(chooseData.children && chooseData.children.length>0){
                    let childData=chooseData.children;
                    childData.forEach((item,idx)=>{                       
                        arr.push(item.id);
                    })
                }
            }else{
                
                if(chooseData.status==0){
                    chooseData['status']=1;
                    typeVal=1;
                    arr.push(chooseData.id);
                    const treeData=this.optionTree;
                    for(let i=0;i<treeData.length;i++){
                        if(treeData[i].children && treeData[i].children.length>0){
                            for(let j=0;j<treeData[i].children.length;j++){
                                if(treeData[i].children[j].id==chooseData.id){
                                    console.log(treeData[i].id,"父节点ID")
                                    
                                    treeData[i]['status']=1;
                                    arr.push(treeData[i].id);
                                }
                            }
                        }                       
                    }
                    console.log(arr,"选中数据")
                }else{
                    chooseData['status']=0;
                    typeVal=2;
                    arr.push(chooseData.id);
                    const treeData=this.optionTree;
                    var canCanLe = true;
                    var parentData = null;
                    for(let i=0;i<treeData.length;i++){
                        if(treeData[i].children && treeData[i].children.length>0){
                            
                            for(let j=0;j<treeData[i].children.length;j++){
                                if(treeData[i].children[j].id==chooseData.id){
                                   let arrData=treeData[i].children;
                                   parentData = treeData[i]
                                   for(let t=0;t<arrData.length;t++){
                                        console.log(arrData[t].id,"子节点ID1111")
                                        if(arrData[t].status==1){
                                            canCanLe = false;
                                            break;
                                        }
                                    }
                                }
                                // console.log(treeData[i].children[j].id,"子节点ID1111")
                                // if(treeData[i].children[j].status==1){
                                   
                                //     canCanLe = false;
                                //     break;
                                // }
                                // if(treeData[i].children[j].id==chooseData.id){
                                //     console.log(treeData[i].id,"父节点ID")
                                //     parentData = treeData[i]
                                //     console.log(treeData[i].children[j].status,"当前节点状态1111")
                                    
                                // }
                                
                            }
                        }                       
                    }
                    if(canCanLe){
                        parentData['status']=0;
                        arr.push(parentData.id);
                    }
                }
                
            }
            console.log(arr,"最后选中的选中数据")
            let params = {
                url: api['updateRoleMenu'].url,
                method: 'post',
                data: {
                    roleId:this.roleId,
                    menuIds:arr,
                    type:typeVal
                }
            }
            console.log(params,"参数111")
            this.loading=true;
            fetch(params).then(res => {
                this.loading=false;;
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
        },
        chooseNode(val){
            // console.log(val,"chooseNode")
            // let chooseData=val;
            // let typeVal=1;
            // let arr=[];
            // debugger
            // if(chooseData.status==0){
            //     chooseData['status']=1;
            //     typeVal=1;
            //     arr.push(chooseData.id);
            // }else if(chooseData.status==1){
            //     chooseData['status']=0;
            //     if(chooseData.children && chooseData.children.length>0){
            //         let childData=chooseData.children;
            //         childData.forEach((item,idx)=>{
            //             if(item.status==1){
            //                 arr.push(item.id);
            //                 typeVal=1;
            //             }else{
            //                 arr.push(item.id);
            //                 typeVal=2;
            //             }
            //         })
            //     }else{
            //         chooseData['status']=0;
            //         typeVal=2;
            //         arr.push(chooseData.id);
            //     }  
            // }
            
            // let params = {
            //     url: api['updateRoleMenu'].url,
            //     method: 'post',
            //     data: {
            //         roleId:this.roleId,
            //         menuIds:arr,
            //         type:typeVal
            //     }
            // }
            // console.log(params,"参数111")
            // this.loading=true;
            // fetch(params).then(res => {
            //     this.loading=false;;
            // }).catch(error => {
            //     this.loading=false;
            //     this.$msgbox({
            //         message:  error.message,
            //         title: '失败',
            //         customClass: 'my_msgBox singelBtn',
            //         dangerouslyUseHTMLString: true,
            //         confirmButtonText: '确定',
            //         type: 'error'
            //     })
            // })
        },
        changeBeginDate(val){
             this.auditData.beginDate=tsmDateToString(val);
        },
        changeEndDate(val){
            this.auditData.endDate=tsmDateToString(val)
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
                url: api['findRoleList'].url,
                method: 'post',
                data: {
                    type:this.optionVal
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                this.tableData = res.data;
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
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>