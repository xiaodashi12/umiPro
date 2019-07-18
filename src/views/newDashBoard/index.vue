<template>
    <div style="position: absolute;height: 100%;width:100%;">
        <etc-hdBar></etc-hdBar>
        <el-row class="tac">
        <el-col :span="4" style="height:100%;">
            <el-menu
            default-active="/userList"
            router
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
                <el-submenu index="usercenter">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户中心</span>
                    </template>
                    <el-menu-item-group>
                        <template slot="title">分组一</template>
                        <el-menu-item index="/userList"  @click='gotoRoute("user")'>员工列表</el-menu-item>
                        <el-menu-item index="/hisList"  @click='gotoRoute("his")'>签约列表</el-menu-item>
                        <el-menu-item index="/channelList"  @click='gotoRoute("channel")'>渠道列表</el-menu-item>
                        <el-menu-item index="/findCustomer"  @click='gotoRoute("findCustomer")'>查找用户车</el-menu-item>
                        <el-menu-item index="/findRedis"  @click='gotoRoute("findRedis")'>获取redis值</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="design">
                    <i class="el-icon-menu"></i>
                    <span slot="title">设置</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="20">
            <router-view />
        </el-col>
    </el-row>
    </div>
    
</template>
<script>
import EtcHdBar from '@/components/HdBar';
  export default {
    components:{EtcHdBar},
    mounted(){
        this.$router.push('/userList');
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      gotoRoute(val){
          switch(val){
            case "user":
                this.$router.push('/userList');
                break;
             case "his":
                this.$router.push('/hisList');
                break;
            case "channel":
                this.$router.push('/channelList');
                break;
                
          }
         
      }
    }
  }
</script>
<style scoped lang="scss">
    .el-menu-item-group__title{
        padding:0px !important;
    }
    .el-menu-vertical-demo{
        height: 100%;
    }
    .tac{
        height: 100%;
    }
    // .el-row{
    //     position: static;
    // }
</style>