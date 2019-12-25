<template>
    <div class='ect-page'>
        <div style="">
            <div>
                <el-table 
                :data="tableData" 
                stripe 
                border 
                :height="screenHeight">
                    <el-table-column prop="id" label="主键" width="100">
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200">
                    </el-table-column>
                    <el-table-column prop="code" label="appid" width="250">
                    </el-table-column>
                    <el-table-column prop="prvCode" label="省编码" width="100">
                    </el-table-column>
                    <el-table-column prop="upCode" label="部编码" width="100">
                    </el-table-column>
                    <el-table-column prop="bankcardType" label="可发银行卡类型" width="150">
                    </el-table-column>
                    <el-table-column prop="blackVersion" label="黑名单文件版本控制" width="250">
                    </el-table-column>
                    <el-table-column prop="merchNo" label="商户号" width="200">
                    </el-table-column>
                    <el-table-column prop="extend" label="扩展字段" width="250" >
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200">
                        <template slot-scope="scope">
                             {{scope.row.createTime | formatDate}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="simpleName" label="简称" width="100" >
                    </el-table-column>
                    <el-table-column prop="identity" label="证件号" width="250">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="150" >
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                             {{scope.row.status==0 ? "关闭" : "正常"}}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button  v-if="scope.row.status=='1'" type="danger" size="small" icon="el-icon-circle-close" @click="closeChanel(scope.row)">关闭渠道</el-button>
                        <el-button  v-else type="primary" size="small" icon="el-icon-circle-check" @click="openChanel(scope.row)">打开渠道</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
// import {dateToString} from '@/utils/utils';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
export default {
    data(){
        return{
            screenHeight: 520,
            areaValue:'',
            tableData: [],
            userInfo:{
                bankcardType:'',
                blackVersion:'',
                carType:'',
                code:'',
                createTime:'',
                extend:'',
                id:'',
                merchNo:'',
                name:'',
                prvCode:'',
                remark:'',
                simpleName:'',
                status:'',
                upCode:'',
                updateTime:'',
            }
            
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=610;
        }
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
        addZero(m) {
            return m < 10 ? '0' + m : m;
        },
        handleClick(row) {
            console.log(row);
        },
        openChanel(row){
            this.$confirm('此操作将打开渠道, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(() => {
                let params = {
                    url: api['openChannel'].url,
                    method: 'post',
                    data: {
                        token: getToken(),
                        id: row.id
                    }
                }
                fetch(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '打开渠道成功!'
                    });
                    this.showDataList();
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
        closeChanel(row){
            console.log(row);
            this.$confirm('此操作将关闭渠道, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(() => {
                let params = {
                    url: api['closeChannel'].url,
                    method: 'post',
                    data: {
                        token: getToken(),
                        id: row.id
                    }
                }
                fetch(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '关闭渠道成功!'
                    });
                    this.showDataList();
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
                url: api['allChannel'].url,
                method: 'post',
                data: {
                    token:getToken()
                }
            }
            fetch(params).then(res => {

                this.tableData = res.data;
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
        height: 84%;
        position: absolute;
        width: 82%;
        padding:10px;
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>