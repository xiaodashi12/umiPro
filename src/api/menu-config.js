module.exports = [
  {
    name: '系统管理',
    id: '2001',
    iconVal:"iconfont etc-icon-yonghuzhongxin",
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
      iconVal:"iconfont etc-icon-consumption",
      sub:[
        {componentName: "clearNotice",id: 30022,name:"清分通知书"},
        {componentName: "intervalReport",id: 30021,name: "苏通卡消费区间报表"},
        {componentName: "bankDataList",id: 30025,name: "联名记账卡消费区间表"},       
        {componentName: "etcRefundForm",id: 30023,name:"ETC退费确认表"},
        {componentName: "consumBookCard",id: 30024,name:"托收记账卡消费区间表"},
      ]
  }, 
  {
      name: '业务-网点报表',
      id: '30031',
      iconVal:"iconfont etc-icon-moduanwangdian",
      sub:[
        {componentName: "branchReport",id: 30031,name: "充值报表"},
        {componentName: "onwerReport",id: 30033,name: "资金来源细分报表"}, 
        {componentName: "dotSale",id: 30036,name: "业务日结报表"},
        {componentName: "sutongDailyReport",id: 30036,name: "服务区充值报表"},
        {componentName: "sinopecRechargeReport",id: 30037,name: "中石化充值报表"},
      ]
  },
  {
    name: '业务-片区报表',
    id: '30032',
    iconVal:"iconfont etc-icon-dangqian",
    sub:[
      {componentName: "branchReportCopy",id: 300321,name: "充值报表"},
      {componentName: "onwerReportCopy",id: 300323,name: "资金来源细分报表"}, 
      {componentName: "dotSaleCopy",id: 300326,name: "业务日结报表"},
      {componentName: "sutongDailyReportCopy",id: 300328,name: "服务区充值报表"},
      {componentName: "sinopecRechargeReportCopy",id: 300327,name: "中石化充值报表"},
    ]
  },
  {
    name: '业务-本部报表',
    id: '30033',
    iconVal:"iconfont etc-icon-wangdian",
    sub:[
      {componentName: "branchReportCofe",id: 300351,name: "充值报表"},
      {componentName: "onwerReportCofe",id: 300353,name: "资金来源细分报表"}, 
      {componentName: "dotSaleCofe",id: 300354,name: "业务日结报表"},
      {componentName: "sutongDailyReportCofe",id: 300356,name: "服务区充值报表"},
      {componentName: "sinopecRechargeReportCofe",id: 300357,name: "中石化充值报表"},
    ]
  },
  {
    name: '销户退款',
    id: '3004',
    iconVal:"iconfont etc-icon-bumenshen",
    sub:[
      {componentName: "userPass", id: 30042, name: "退款提交"},
      {componentName: "pianquPass", id: 30044, name: "片区校核"},
      {componentName: "caiwuPass", id: 30045, name: "财务审核"}
    ]
  },
  // {
  //     name: '充值报表',
  //     id: '3003',
  //     iconVal:"iconfont etc-icon-chongzhi01-copy",
  //     sub:[
  //       {componentName: "branchReport",id: 30031,name: "自己网点充值"},
  //       {componentName: "onwerReport",id: 30032,name:"自营网点资金来源细分区间报表"},
  //       {componentName: "allReport",id: 30033,name: "所有网点充值"},
              
  //       {componentName: "sutongRefundForm",id: 30036,name: "苏通卡客户销户退款批量审批单"},
  //       {componentName: "sutongDailyReport",id: 30037,name: "服务区苏通卡服务点资金日报表"},
  //     ]
  // },
  
  // {
  //   name: '财务列表',
  //   id: '3005',
  //   iconVal:"iconfont etc-icon-caiwu",
  //   sub:[
  //     // {componentName: "dotSale", id: 30051, name: "网点设备销售来源核对日表"},
  //     {componentName: "serviceFundRecond", id: 30052, name: "服务区资金对账"},
  //     {componentName: "capitalOperateOutlet", id: 30053, name: "自营网点资金对账"},
  //   ]
  // },
  // {
  //   name: '销售列表',
  //   id: '3006',
  //   iconVal:"iconfont etc-icon-xiaoshou",
  //   sub:[
  //     {componentName: "dotSale", id: 30061, name: "网点设备销售来源核对日表"},
  //     {componentName: "electronicSales", id: 30062, name: "电子标签销售区间报表"},
  //   ]
  // }
]

