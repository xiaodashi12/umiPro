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
          name: '充值报表',
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
          name: '自营网点充值',
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
          path: '/b',
          component: () => import('./views/newDashBoard/userCenter/intervalReport/index'),
          name: '消费区间报表',
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
          path: '/c',
          component: () => import('./views/newDashBoard/userCenter/bankDataList/index'),
          name: '银行报表',
          menuShow: true, 
          meta:{requireAuth: true }
        },
      ]
    },
  ]
})
