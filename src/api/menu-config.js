module.exports = [
  {
    name: '用户中心',
    id: '2001',
    sub: [
      {componentName: "userlist", id: 2002, name: "员工列表"},
      {componentName: "hislist", id: 2003, name: "签约列表"},
      {componentName: "channellist", id: 2004, name: "渠道列表"},
      {componentName: "findCustomer", id: 2005, name: "查找用户车"},
      {componentName: "findRedis", id: 2006, name: "获取redis值"},
      {componentName: "roleMenu", id: 2007, name: "权限菜单"},
      {componentName: "findRoleList", id: 2012, name: "角色查询"},
      
    ]
  },
  {
      name: '消费报表',
      id: '3002',
      sub:[
        {componentName: "intervalReport",id: 30021,name: "苏通卡消费情况区间报表"},
        {componentName: "clearNotice",id: 30022,name:"清分通知书"},
        {componentName: "etcRefundForm",id: 30023,name:"ETC退费确认表"},
        {componentName: "consumBookCard",id: 30024,name:"记账卡用户消费统计月报表"},
      ]
  }, 
  {
      name: '充值报表',
      id: '3003',
      sub:[
        {componentName: "rechargeList",id: 30031,name: "自己网点充值"},
        {componentName: "onwerReport",id: 30032,name:"自营网点资金来源细分区间报表"},
        {componentName: "allReport",id: 30033,name: "所有网点充值"},
        {componentName: "bankDataList",id: 30035,name: "银行联名记账"},        
        {componentName: "sutongRefundForm",id: 30036,name: "苏通卡客户销户退款批量审批单"},
        {componentName: "sutongDailyReport",id: 30037,name: "服务区苏通卡服务点资金日报表"},
        // {componentName: "appSumaryList",id: 30031,name: "各合作单位充值报表"},
        // {componentName: "bankSumaryList",id: 30032,name:"招行APP充值圈存区间报表（区间）"},
        // {componentName: "rechargeMoney",id: 30033,name: "网上充值报表"},
        // {componentName: "summaryMoneyList",id: 30034,name: "各银行充值报表"}
      ]
  },
  {
    name: '审核列表',
    id: '3004',
    sub:[
      {componentName: "userPass", id: 30042, name: "员工审核"},
      {componentName: "branchPass", id: 30043, name: "网点审核"},
      {componentName: "pianquPass", id: 30044, name: "片区审核"},
      {componentName: "caiwuPass", id: 30045, name: "财务审核"}
    ]
  },
  {
    name: '财务列表',
    id: '3005',
    sub:[
      {componentName: "dotSale", id: 30051, name: "网点设备销售来源核对日表"},
      {componentName: "serviceFundRecond", id: 30052, name: "服务区资金对账"},
      {componentName: "capitalOperateOutlet", id: 30053, name: "自营网点资金对账"},
    ]
  }
]
