<template>
    <div class="load-err-deal-container">
        <div class="load-err-deal-content">
            <div class="title">车主信息</div>
            <div class="infos">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{passData.customerId}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车主姓名：</label>
                        <span class="rg">{{passData.name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车主证件号：</label>
                        <span class="rg">{{passData.identity}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{passData.licenseCode}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{plateColorToColorMap.get(passData.licenseColor+'')}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">CPU卡片信息</div>
            <div class="infos">
                <el-row :span="24">
                    <el-col :span="8">
                        <el-radio-group v-model="passData.hasCard">
                            <el-radio-button :label=0>无卡</el-radio-button>
                            <el-radio-button :label=1>有卡</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>CPU卡号：</label>
                        <span class="rg">{{passData.cpuCardId}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡内余额：</label>
                        <span class="rg">{{passData.cardAmount/100}}（元）</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">办理人信息</div>
            <div class="infos">
                <el-row :span="24">
                    <el-col :span="12">
                        <div  class="dataInput">
                            <label>银行账号：</label>
                            <!-- <span class="rg">{{passData.bankCardId}}</span> -->
                            <el-input 
                                size="small" 
                                placeholder="请输入银行账号"
                                :readonly="isBeDisabled" 
                                auto-complete="off"
                                v-model="passData.bankCardId"/>
                        </div>
                        
                    </el-col>
                    <el-col :span="12">
                        <label>账户名称：</label>
                        <span class="rg">{{passData.branchNo}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="12" class="dataInput">
                        <label>开户银行：</label>
                        <!-- <span class="rg">{{passData.bankName}}</span> -->
                        <el-input   
                            size="small" 
                            
                            :readonly="isBeDisabled"
                            placeholder="请输入开户银行" 
                            auto-complete="off"
                            v-model="passData.bankName"/>
                    </el-col>
                    <el-col :span="12">
                        <label>联系电话：</label>
                        <span class="rg">{{passData.phone}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="12" class="dataInput">
                        <label>开户行地址：</label>
                        <!-- <span class="rg">{{passData.bankAddress}}</span> -->
                        <el-input 
                            size="small" 
                            :readonly="isBeDisabled"
                            placeholder="开户行地址" 
                            auto-complete="off"
                            v-model="passData.bankAddress"/>
                    </el-col>
                    <el-col :span="12">
                        <label>销户原因：</label>
                        <span class="rg">{{passData.reason}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="infos">
                <el-row :span="24">
                    <el-col :span="2">
                        <label>电子凭证：</label>
                    </el-col>
                    <el-col :span="22" class="technoInfo">
                        <viewer :images="slideImg">
                        <div class="divInfo inlineInfo" v-for="(item,idx) in slideImg" :key="idx">
                           
                                <img
                                style="width: 100%; height: 100%;"
                                :src="item.vcPicUrl"
                                />
                        </div>
                        </viewer>
                        
                    </el-col>
                    
                </el-row>
            </div>
            
        </div>
        <div class="infos">
            <div class="infoFlexDiv" v-if="isBeDisabled">
                <div class="infoFlex infoFlexBtn" @click="handleClick(1)">
                    通过
                </div>                
                <div class="infoFlex infoFlexBtnd" @click="handleClick(0)" v-if="isControl !='0'">
                    拒绝
                </div>
                <div class="infoFlex infoFlexGray" @click="handleClick(0)" v-else>
                    拒绝
                </div>
            </div>
            <div class="infoFlexDiv" v-else>
                <div class="infoFlex infoFlexBtn" @click="handleEnsureClick(1)">
                    保存
                </div>                
                <div class="infoFlex infoFlexBtnd" @click="handleEnsureClick(0)">
                    取消
                </div>
            </div>       
        </div>
        <el-dialog
        title="审核信息"
        :visible.sync="dialogVisible"
        style="height:320px;"
        append-to-body
        :before-close="handleClose">
            <div class="infos" style="padding:20px;">
                <el-form ref="manualModel"
                         size="small"
                         :model="manualModel"
                         :rules="rules"
                         label-position="right">
                    <el-row :span="24" v-if="rgtIdx==1 && isShowMoney">
                        <el-col :span="20">
                            <el-form-item label="金额：" class="item" prop="money">
                                <el-input size="small" placeholder="请输入金额" 
                                            auto-complete="off"
                                            v-model="manualModel.money"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-if="rgtIdx==1">
                        <el-col :span="20">
                            <el-form-item label="备注：" class="item" prop="okRemark">
                                <el-input size="small" placeholder="请输入备注"
                                            auto-complete="off"
                                            v-model="manualModel.okRemark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-if="rgtIdx==0">
                        <el-col :span="20">
                            <el-form-item label="备注：" class="item" prop="remark">
                                <el-input size="small" placeholder="请输入备注"
                                            auto-complete="off"
                                            v-model="manualModel.remark"/>
                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-if="showText">
                        <div style="color:red;">请输入退回原因</div>
                    </el-row>
                    
                </el-form>
                <div style="float:right;">
                    <el-button type="primary" size="small" style="width: 100px" @click="ensureData">确 定</el-button>
                    <el-button type="primary" size="small" style="width: 100px" @click="dialogVisible=!dialogVisible">取 消</el-button>
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>

<script>

import {platePadFloorMap,plateColorToColorMap,procesStatusMap} from '@/utils/dictionaries';
import api from '@/api'
import fetch from '@/utils/fetch'
import {getToken} from '@/utils/auth';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";

    export default {
        name: "ManualHandle",
        components: {
            
        },
        props: {
            isControl:{
                type: Number,
                default:0
            },
            passData: {
                type: Object,
                default:{}
            },
            isBeDisabled:{
                type:Boolean,
                default:true
            },
            slideImg:{
                type:Array,
                default:[]
            },
            isShowMoney:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                showText:false,
                rgtIdx:0,
                manualModel:{
                    money:'',
                    remark:'',
                    okRemark:'退款提交'
                },
                plateColorToColorMap,
                procesStatusMap,
                platePadFloorMap,
                radioVal:'0',
                dialogVisible:false,
                active: 0,
                currentRow: {
                    cur: false
                },
                rules: {
                    remark:[
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                }
                //visible:visible
            }
        },
        watch: {
        },
        created(){
        },
        // destroyed() {
        //
        // },
        mounted() {
        },
        methods: {
            inite (viewer) {
                this.$viewer = viewer
            },
            ensureData(){
                if(this.rgtIdx==0 && this.manualModel.remark==""){
                    this.showText=true;
                    return;
                }else{
                    this.showText=false;
                }
                let money=this.manualModel.money;
                let data={};
                if(money=='' || money==0){
                    data={
                        flag: this.rgtIdx,
                        id:this.passData.id,
                        remark:this.rgtIdx==0 ? this.manualModel.remark : this.manualModel.okRemark,
                    }
                }else{
                    data={
                        flag: this.rgtIdx,
                        id:this.passData.id,
                        money:money,
                        remark:this.rgtIdx==0 ? this.manualModel.remark : this.manualModel.okRemark,
                    }
                }
                
                let params = {
                    url: api['getProcess'].url,
                    method: 'post',
                    data: data
                }
                this.loading = true;
                fetch(params).then(res => {
                    this.$msgbox({
                        message:  this.rgtIdx == 1 ? '审核通过成功' : '拒绝通过成功',
                        title: '成功',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'success'
                    }).then(action => {
                        this.$emit('closeDialog'); 
                        this.dialogVisible=false;
                        this.showText=false;
                    });
                }).catch(error => {
                    this.loading = false;
                    this.$msgbox({
                        message:  error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'error'
                    }).then(action => {
                        this.$emit('closeDialog'); 
                        this.dialogVisible=false;
                        this.showText=false;
                    });
                })
            },
            handleClose(){
                this.dialogVisible=false;
                this.showText=false;
            },
            handleClick(idx) {
                this.rgtIdx=idx;
                if(this.isBeDisabled && idx==0 && this.isControl==0){
                    return;
                }   
                this.dialogVisible=true;
                this.$nextTick(()=>{
                    this.$refs.manualModel.resetFields();
                })
            },
            handleEnsureClick(idx){
                if(idx==1){
                    this.$confirm('此操作将保存编辑后的信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            url: api['updateApply'].url,
                            method: 'post',
                            data: {
                                backMoney: this.passData.backMoney,
                                backMoneyStatus: this.passData.backMoneyStatus,
                                bankAddress: this.passData.bankAddress,
                                bankCardId: this.passData.bankCardId,
                                bankName: this.passData.bankName,
                                branchNo: this.passData.branchNo,
                                cardAmount:this.passData.cardAmount,
                                cpuCardId: this.passData.cpuCardId,
                                createTime: this.passData.createTime,
                                customerId: this.passData.customerId,
                                driverId: this.passData.driverId,
                                driverName: this.passData.driverName,
                                files: this.passData.files,
                                hasCard: this.passData.hasCard,
                                hasObu: this.passData.hasObu,
                                id: this.passData.id,
                                identity: this.passData.identity,
                                licenseCode: this.passData.licenseCode,
                                licenseColor: this.passData.licenseColor,
                                name: this.passData.name,
                                opratorId: this.passData.opratorId,
                                phone: this.passData.phone,
                                processStatus: this.passData.processStatus,
                                reason: this.passData.reason,
                                remark: this.passData.remark,
                                status: this.passData.status,
                                updateTime: this.passData.updateTime,
                            }
                        }
                        this.loading = true;
                        fetch(params).then(res => {
                            this.$msgbox({
                                message:  '保存信息成功',
                                title: '成功',
                                customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: '确定',
                                type: 'success'
                            }).then(action => {
                                this.dialogVisible=false;
                                this.showText=false;
                                this.$emit('closeDialog'); 
                            });
                        }).catch(error => {
                            this.loading = false;
                            this.$msgbox({
                                message:  error.message,
                                title: '失败',
                                customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: '确定',
                                type: 'error'
                            }).then(action => {
                                this.dialogVisible=false;
                                 this.showText=false;
                                this.$emit('closeDialog'); 
                            });
                        })
                    }).catch(() => {

                    });
                    
                }else if(idx==0){
                    this.$emit('closeDialog');    
                }
            }
        },
        computed: {
            
            

        }
    }
</script>

<style lang="scss" scoped>
    .infoFlexDiv{
        display:flex;
        width:100%;
        .infoFlex{
            cursor:pointer;
            flex:1;
            color:#fff;
            height:40px;
            line-height:40px;
            font-size:24px;
            text-align:center;
        }
        .infoFlexBtn{
            background-color:#67c23a;
        }
        .infoFlexBtnd{
            background-color:#f56c6c;
        }
        .infoFlexGray{
            background-color:#bababa;
        }
    }
    
    .load-err-deal-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        .load-err-deal-content {
            // height: 452px;
            overflow-y: auto;
            overflow-x: hidden;

            background: #ffffff;

            .input {
                width: 136px !important;
            }

            .el-row {
                margin-left: 30px;
            }

            .title {
                letter-spacing: 2px;
                font-family: 'PingFangSC-Regular';
                text-align: left;
                height: 22px;
                line-height: 22px;
                color: #000000;
                border-left: 2px solid #5584ff;
                padding: 0px 0px 0px 12px;
                margin: 12px 0px 12px 52px;

                span {
                    color: #a0a2ad;
                    font-size: 12px;
                    display: inline-block;
                    margin-left: 36px;
                }
            }
            .infosed{
                 margin: 0px 0px 12px 60px;

                .el-col {
                    text-align: right;
                    padding: 6px 0px 6px 0px;
                    
                    label {
                        display: inline-block;
                        font-size: 12px;
                        color: #999999;
                        text-align: right;
                        min-width: 70px;
                        font-weight: normal;
                        padding-right: 8px;
                    }

                    .rg {
                        display: inline-block;
                        text-align: left;
                        font-size: 14px;
                        min-width: 60px;
                        color: #000000;
                    }
                }
            }
            .infos {
                margin: 0px 0px 12px 60px;

                .el-col {
                    text-align: left;
                    padding: 6px 0px 6px 0px;
                    .divInfo{
                        width:150px;
                        height:150px;
                        border:1px dashed #bababa;
                    }
                    .inlineInfo{
                        display:inline-block;
                        margin:0 10px;
                    }
                    label {
                        display: inline-block;
                        font-size: 12px;
                        color: #999999;
                        text-align: right;
                        min-width: 70px;
                        font-weight: normal;
                        padding-right: 8px;
                    }

                    .rg {
                        display: inline-block;
                        text-align: left;
                        font-size: 14px;
                        min-width: 60px;
                        color: #000000;
                    }
                }

                .label label {
                    padding: 0px;
                    margin: 0;
                    min-width: 50px;
                }
            }
        }
    }

</style>
<style type="text/scss" lang="scss">
    .item {
        .el-form-item__content {
            display: flex;
            flex-flow: row;

            .el-input__inner {
                color: #999;
            }
        }

    }
    .dataInput{
        display: flex;
        flex-flow: row;

        .el-input__inner {
            color: #999;
        }
        label{
            width:90px;
        }
    }
</style>