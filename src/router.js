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
        {path: '/userlist',component: () => import('./views/newDashBoard/userList/userList'),name: '用户列表',menuShow: true, meta:{requireAuth: true }},
        {path: '/hislist',component: () => import('./views/newDashBoard/hisList/hisList'),name: '签约列表',menuShow: true, meta:{requireAuth: true }},
        {path: '/channellist',component: () => import('./views/newDashBoard/channelList/channelList'),name: '签约渠道',menuShow: true, meta:{requireAuth: true }},
        {path: '/findCustomer',component: () => import('./views/newDashBoard/findCustomer/findCustomer'),name: '查找用户车',menuShow: true, meta:{requireAuth: true }},
        {path: '/findRedis',component: () => import('./views/newDashBoard/findRedis/findRedis'),name: '获取redis值',menuShow: true, meta:{requireAuth: true }},
      ]
    },
  ]
})
