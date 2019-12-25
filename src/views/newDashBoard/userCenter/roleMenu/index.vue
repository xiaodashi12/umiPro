<template>
    <div class='ect-page'>
        <div style="margin:20px 30px;">
            <el-row style="display:flex;align-items:center;">
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">同步用户数据 </label>
                </el-col>
                <el-col :span="3" style="margin:0 20px;"> 
                    <el-button type="primary" @click="syncData">开始同步用户数据</el-button>
                </el-col>  
            </el-row>
            <el-row style="display:flex;align-items:center;">
            	<el-col :span="2" class="etc-col">
                    <label class="ect-input">类型:</label>
                </el-col>
            	<el-col :span="2" style="margin-left:10px;">
                    <el-select v-model="roleType" clearable  placeholder="请选择" @change="selectChange">
                        <el-option
                        v-for="item in roleTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">角色:</label>
                </el-col>
                <el-col :span="2" style="margin-left:10px;">
                    <el-select v-model="role" clearable  placeholder="请选择" >
                        <el-option
                        v-for="item in roles"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                
            	
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">银行编码前几位</label>
                </el-col>
                <el-col :span="3">   
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="entityIdPre"
                            @blur="handleEventEntityIdPre($event)"
                        />
                    </div>
                </el-col>
                <el-col :span="3" style="margin:0 20px;"> 
                    <el-button type="primary" @click="updateRole">设置权限</el-button>
                </el-col>  
            </el-row>
            
        </div>
        <div>
            {{bankData}}
        </div>
    </div>
    
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
import {plateColorToColorMap} from "@utils/dictionaries"
export default {
    data(){
        return{
        	roleType:null,
            roleTypes:[{id:0,name:'柜面'},{id:1,name:'PAD'}],
            role:null,
            roles:[],
            entityIdPre:'',
            plateColorToColorMap,
            screenHeight: document.body.clientHeight-180,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            tableData: [],
            total:0,
            bankData:'',
            userInfo:{
                clientId:'',
                licenseColor:'',
                licensePlate:'',
            }
            
        }
    },
    created(){
    },
    methods: {
        handleEventEntityIdPre(event){
            this.handleEvent=event.target.value;
        },
        selectChange(event){
            console.log(event)
            this.roles=[]
            this.role=null
            let params ={
            	url:api['findRoleByType'].url,
            	method:api['findRoleByType'].method,
            	data:{
            		token:getToken(),
            		type:event
            	}
            }
            fetch(params).then(res => {
	            console.log(res);
	            this.roles=res.data;
	        })
            
        },
  		syncData(){
  			let params = {
	            url: api['syncData'].url,
	            method: api['syncData'].method,
	            data: {
	                token:getToken(),
	            }
           }
  			fetch(params).then(res => {
	            console.log(res);
	            this.$msgbox({
	                message:  '同步成功' ,
	                title: '成功',
	                customClass: 'my_msgBox singelBtn',
	                dangerouslyUseHTMLString: true,
	                confirmButtonText: '确定',
	                type: 'error'
	            })
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
  			
  		},
       updateRole(){
           let params = {
	            url: api['updateRoleIdByBranchPre'].url,
	            method: 'post',
	            data: {
	                token:getToken(),
	                type:this.roleType,
	                entityIdPre:this.entityIdPre,
	                roleId:this.role
	            }
           }
	        fetch(params).then(res => {
	            console.log(res);
	            this.$msgbox({
	                message:  '设置了['+res.data+']个用户' ,
	                title: '成功',
	                customClass: 'my_msgBox singelBtn',
	                dangerouslyUseHTMLString: true,
	                confirmButtonText: '确定',
	                type: 'error'
	            })
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
        width: 82%;
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px 0;
    }
    .el-input__inner{
        padding:0px !important;
        margin:0px !important;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>