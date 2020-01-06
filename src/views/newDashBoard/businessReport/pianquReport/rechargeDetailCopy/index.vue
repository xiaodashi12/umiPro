<template>
    <div class="app-container">
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;" class="speSearch">
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
                <span style="margin-left:10px;">充值状态：</span>
                 <el-select size="small" v-model="auditData.status" placeholder="请选择">
                    <el-option
                    v-for="item in speOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                 <span style="margin-left:10px;"> 充正状态：</span>
                <el-select size="small" v-model="auditData.equilibriumStatus" placeholder="请选择">
                    <el-option
                    v-for="item in choOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
            </el-row>
            <el-row style="display:flex;align-items:center;" class="speSearch">
                 <span style="margin-left:10px;">卡号：</span>
                <el-input
                size="small"
                placeholder="请输入卡"
                v-model="auditData.cpuCardId"
                clearable>
                </el-input>
                <span style="margin-left:10px;">车牌号：</span>
                <el-input
                size="small"
                placeholder="请输入网点编号"
                v-model="auditData.licenseCode"
                clearable>
                </el-input>
                <span style="margin-left:10px;">网点编号：</span>
                <el-input
                size="small"
                placeholder="请输入网点编号"
                v-model="auditData.branchNo"
                clearable>
                </el-input>
                <el-col :span="5">
                    <div class="grid-content bg-purple-light ect-input" style="margin-left:10px;">
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-download" @click="exported">导出</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:100px;" class="specialTable">
            <div>
                <el-table 
                :data="tableData" 
                stripe 
                border 
                :height="screenHeight"
                v-loading="loading"
                id="table">
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="changeType(scope.row)">修改充值方式</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vcOpName" label="操作员" align="center">
                    </el-table-column>
                    <el-table-column prop="vcBranchName" label="网点名称" align="center">
                    </el-table-column>
                    <el-table-column prop="cpuCardId" label="卡号" align="center">
                    </el-table-column>
                    <el-table-column prop="licenseCode" label="车牌号" align="center">
                    </el-table-column>
                    <el-table-column prop="licenseColor" label="车牌颜色" align="center">
                         <template slot-scope="scope">
                             {{plateColorToColorMap.get(scope.row.licenseColor)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payMoney" label="充值金额" align="center">
                        <template slot-scope="scope">
                             {{scope.row.payMoney/100}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payChannel" label="充值方式" align="center">
                        <template slot-scope="scope">
                             {{platePayTypeMap.get(scope.row.payChannel)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        
                    </el-table-column>
                    <el-table-column prop="status" label="充值状态" align="center">
                        <template slot-scope="scope">
                             {{plateChoStatusFloorMap.get(scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="是否冲正" align="center">
                        <template slot-scope="scope">
                             <span v-if="scope.row.status==1 && scope.row.needEquilibrium==1">冲正成功</span>
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
        </div>
        <el-dialog
            title="充值数据明细"
            :visible.sync="dialogVisible"
            width="520px"
            :before-close="handleClose">
            <div class="load-err-deal-container">
                <div class="load-err-deal-content">
                    <div class="infos">
                        <el-row :span="24">
                            <el-col :span="24">
                                <label>订单号：</label>
                                <span class="rg">{{nowData.orderId}}</span>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <label>操作员：</label>
                                <span class="rg">{{nowData.vcOpName}}</span>
                            </el-col>
                            <el-col :span="12">
                                <label>网点名称：</label>
                                <span class="rg">{{nowData.vcBranchName}}</span>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <label>卡号：</label>
                                <span class="rg">{{nowData.cpuCardId}}</span>
                            </el-col>
                            <el-col :span="12">
                                <label>创建时间：</label>
                                <span class="rg">{{nowData.createTime}}</span>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <label>车牌号：</label>
                                <span class="rg">{{nowData.licenseCode}}</span>
                            </el-col>
                            <el-col :span="12">
                                <label>车牌颜色：</label>
                                <span class="rg">{{plateColorToColorMap.get(nowData.licenseColor+'')}}</span>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <label>充值方式：</label>
                                <span class="rg">
                                    <el-select size="mini" style="width:120px;" v-model="nowData.payChannel" placeholder="请选择">
                                        <el-option
                                        v-for="item in moneyOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select></span>
                            </el-col>
                            <el-col :span="12">
                                <label>充值金额：</label>
                                <span class="rg">{{nowData.payMoney/100}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="infos" style="text-align:right;">
                        <el-button size="small" @click="handleClick()" type="primary">
                            修改
                        </el-button>                
                        <el-button size="small" @click="dialogVisible=!dialogVisible">
                            取消
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
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
            dialogVisible:false,
            moneyOptions: [{
                value: 1,
                label: '现金'
            },{
                value: 3,
                label: 'pos机',
            },{
                value: 4,
                label: '转帐'
            }],
            nowData:{
                cpuCardId: "",
                createTime: "",
                licenseCode: "",
                licenseColor: "0",
                payChannel: 1,
                payMoney: 0,
                vcBranchName: "",
                vcOpName: "",
                orderId:''
            },
            plateChoStatusFloorMap,
            plateColorToColorMap,
            speVal:'-1',
            speOptions: [{
                value: '-1',
                label: '全部'
            },{
                value: '1',
                label: '成功'
            }, {
                value: '2',
                label: '失败',
            }],
            choVal:'0',
            choOptions: [{
                value: '-1',
                label: '全部'
            },{
                value: '0',
                label: '未冲正'
            },{
                value: '1',
                label: '已冲正'
            }],
            value: '',
            loading:false,
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
        // this.showDataList();
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
        handleClick(){
            this.$confirm('此操作将修改充值方式, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    url: api['updatePayChannelPian'].url,
                    method: 'post',
                    data: {
                        orderId:this.nowData.orderId,
                        payChannel:this.nowData.payChannel,
                    }
                }
                fetch(params).then(res => {
                    this.showDataList();
                    this.$msgbox({
                        message: '修改成功',
                        title: '成功',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'success'
                    })
                }).catch(error => {
                    this.$msgbox({
                        message:  error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                    this.showDataList();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        exported(){
            let table = document.getElementById('table');
            let worksheet = XLSX.utils.table_to_sheet(table);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
            // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
            let workbooked = XLSX.utils.table_to_book(document.getElementById('table'))
            XLSX.writeFile(workbooked, '充值报表.xlsx');
        },
        handleClose(){
            this.dialogVisible=false;
        },
        changeType(row){
            this.nowData=row;
            this.dialogVisible=true;
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
                url: api['findOrderDetailPinQuSome'].url,
                method: 'post',
                data: {
                    startDate:this.auditData.beginDate,
                    endDate:this.auditData.endDate,
                    status:this.auditData.status,
                    equilibriumStatus:this.auditData.equilibriumStatus,
                    cpuCardId:this.auditData.cpuCardId=='' ? null : this.auditData.cpuCardId,
                    licenseCode:this.auditData.licenseCode=='' ? null : this.auditData.licenseCode,
                    branchNo:this.auditData.branchNo=='' ? null : this.auditData.branchNo,
                    pageIndex: this.pageIndexed,
                    pageSize: this.pageSized
                }
            }
            this.loading=true;
            fetch(params).then(res => {
                this.tableData = res.data.data;
                this.total=res.data.total;
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
    .infos{
        .el-row{
            padding:10px 0;
        }
    }
</style>