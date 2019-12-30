import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component:() => import('./views/Login')
    },{
      path:'/',
      component:() => import('./views/layout'),
      redirect: '/newDashBoard',
      name: 'NewDashBoard',
      hidden: true,
      children: [{
          path: 'newDashBoard',
          component: () => import('./views/newDashBoard/index')
      }]
    },
    {
      path: '/',
      component: () => import('./views/newDashBoard/index'),
      name: '用户管理',
      menuShow: true,
      iconCls: 'iconfont icon-users',
      children: [
        {
          path: '/index',
          component: () => import('./views/newDashBoard/home/index'),
          name: '首页',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/userlist',
          component: () => import('./views/newDashBoard/userCenter/userList/userList'),
          name: '用户列表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/hislist',
          component: () => import('./views/newDashBoard/userCenter/hisList/hisList'),
          name: '签约列表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/channellist',
          component: () => import('./views/newDashBoard/userCenter/channelList/channelList'),
          name: '渠道列表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/findCustomer',
          component: () => import('./views/newDashBoard/userCenter/findCustomer/findCustomer'),
          name: '查找用户车',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/findRedis',
          component: () => import('./views/newDashBoard/userCenter/findRedis/findRedis'),
          name: '获取Redis值',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/customerList',
          component: () => import('./views/newDashBoard/userCenter/customerList/customerList'),
          name: '客户列表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/roleMenu',
          component: () => import('./views/newDashBoard/userCenter/roleMenu/index'),
          name: '权限菜单',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/branchReport',
          component: () => import('./views/newDashBoard/moneyList/rechargeList/index'),
          name: '自己网点充值',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/allReport',
          component: () => import('./views/newDashBoard/moneyList/allReport/index'),
          name: '所有网点充值',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/onwerReport',
          component: () => import('./views/newDashBoard/moneyList/onwerReport/index'),
          name: '自营网点资金来源细分区间报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/sutongRefundForm',
          component: () => import('./views/newDashBoard/moneyList/sutongRefundFprm/index'),
          name: '苏通卡客户销户退款批量审批单',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/findRoleList',
          component: () => import('./views/newDashBoard/userCenter/findRoleList/index'),
          name: '角色权限配置',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/intervalReport',
          component: () => import('./views/newDashBoard/consumList/intervalReport/index'),
          name: '苏通卡消费情况区间报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/clearNotice',
          component: () => import('./views/newDashBoard/consumList/clearNotice/index'),
          name: '清分通知书',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/etcRefundForm',
          component: () => import('./views/newDashBoard/consumList/etcRefundForm/index'),
          name: 'ETC退费确认表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/consumBookCard',
          component: () => import('./views/newDashBoard/consumList/consumBookCard/index'),
          name: '记账卡用户消费统计月报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/a',
          component: () => import('./views/newDashBoard/userCenter/moneyChoose/index'),
          name: '消费报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/bankDataList',
          component: () => import('./views/newDashBoard/moneyList/bankDataList/index'),
          name: '银行联名记账',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/d',
          component: () => import('./views/newDashBoard/specialPage/refundAccount/index'),
          name: '圈存汇总表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/appSumaryList',
          component: () => import('./views/newDashBoard/moneyList/appSumaryList/index'),
          name: '各合作单位充值报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/bankSumaryList',
          component: () => import('./views/newDashBoard/moneyList/bankSumaryList/index'),
          name: '招行APP充值圈存区间报表（区间）',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/sutongDailyReport',
          component: () => import('./views/newDashBoard/moneyList/sutongDailyReport/index'),
          name: '服务区苏通卡服务点资金日报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/rechargeMoney',
          component: () => import('./views/newDashBoard/moneyList/rechargeMoney/index'),
          name: '网上充值报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/summaryMoneyList',
          component: () => import('./views/newDashBoard/moneyList/summaryMoneyList/index'),
          name: '各银行充值报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/userPass',
          component: () => import('./views/newDashBoard/specialPage/refundAccount/list'),
          name: '员工审核',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/branchPass',
          component: () => import('./views/newDashBoard/specialPage/refundAccount/branchList'),
          name: '网点审核',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/pianquPass',
          component: () => import('./views/newDashBoard/specialPage/refundAccount/pianquList'),
          name: '片区审核',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/caiwuPass',
          component: () => import('./views/newDashBoard/specialPage/refundAccount/caiwuList'),
          name: '财务审核',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/serviceFundRecond',
          component: () => import('./views/newDashBoard/finalState/serviceFundRecond/index'),
          name: '服务区资金对账',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/capitalOperateOutlet',
          component: () => import('./views/newDashBoard/finalState/capitalOperateOutlet/index'),
          name: '自营网点资金对账',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/dotSale',
          component: () => import('./views/newDashBoard/saleReport/dotSale/index'),
          name: '网点设备销售来源核对日表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
        {
          path: '/electronicSales',
          component: () => import('./views/newDashBoard/saleReport/electronicSales/index'),
          name: '电子标签销售区间报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
      ]
    },
  ]
})
