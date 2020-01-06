const config = {
    'login': {
        url: '/operator/login',
        method: ''
    },
    'userList':{
        url: '/operator/findOperator',
        method: ''
    },
    'resetPwd':{
        url: '/operator/resetPassword',
        method: ''
    },
    'findHisList':{
        url: '/electronicAccountHis/findHisList',
        method: ''
    },
    'cancleSign':{
        url: '/electronicAccountHis/cancleSign',
        method: ''
    },
    'allChannel':{
        url: '/findAllChannel',
        method: ''
    },
    'closeChannel':{
        url: '/closeChannel',
        method: ''
    },
    'openChannel':{
        url: '/openChannel',
        method: ''
    },
    'findCustomer':{
        url: '/redis/findCustomerCar',
        method: ''
    },
    'findRedis':{
        url: '/redis/findRedisValue',
        method: ''
    },
    'removeCustomer':{
        url: '/redis/removeCustomerCar',
        method: ''
    },
    'findCardPub':{
        url: '/cardpub/findCardPub',
        method: ''
    },
    'cardLost':{
        url: '/cardpub/cardLost',
        method: ''
    },
    'cardUnLost':{
        url: '/cardpub/cardUnLost',
        method: ''
    },
    'findRoleByType':{
    	url:'sysUserRole/findRoleByType',
    	method:'post'
    },
    'updateRoleIdByBranchPre':{
    	url:'sysUserRole/updateRoleIdByBranchPre',
    	method:'post'
    },
    'syncData':{
    	url:'operator/copy',
    	method:'post'
    },
    'onwerReport':{
    	url:'rechargeReport/onwerReport',
    	method:'post'
    },
    'allReport':{
    	url:'rechargeReport/allReport',
    	method:'post'
    },
    'branchReport':{
    	url:'rechargeReport/branchReport',
    	method:'post'
    },
    'findRoleList':{
    	url:'sysUserRole/findRoleList',
    	method:'post'
    },
    'sysUserMenu':{
    	url:'sysUserRole/menu',
    	method:'post'
    },
    'updateRoleMenu':{
    	url:'sysUserRole/updateRoleMenu',
    	method:'post'
    },
    'updateUserRole':{
    	url:'sysUserRole/updateUserRole',
    	method:'post'
    },
    'findUserRole':{
    	url:'sysUserRole/findUserRole',
    	method:'post'
    },
    'addRole':{
    	url:'sysUserRole/addRole',
    	method:'post'
    },
    'findList':{
    	url:'refundApply/findList',
    	method:'post'
    },
    'getProcess':{
    	url:'refundApply/process',
    	method:'post'
    },
    'updateApply':{
    	url:'refundApply/updateApply',
    	method:'post'
    },
    'sellReportForBranch':{
    	url:'/rechargeReport/sellReportForBranch',
    	method:'post'
    },
    'rechargeBranch':{
    	url:'/rechargeReport/branch',
    	method:'post'
    },
    'pinQuReport':{
    	url:'/rechargeReport/pinQuReport',
    	method:'post'
    },
    'rechargeAllReport':{
    	url:'/rechargeReport/allReport',
    	method:'post'
    },
    'queryClear':{
    	url:'/rechargeReport/queryClear',
    	method:'post'
    },
    'findOrderDetailBranch':{
    	url:'/detail/findOrderDetailBranch',
    	method:'post'
    },
    'findOrderDetailBranchToday':{
    	url:'/detail/findOrderDetailBranchToday',
    	method:'post'
    },
    'equilibrium':{
    	url:'/detail/equilibrium',
    	method:'post'
    },
    'findOrderDetailPinQu':{
    	url:'/detail/findOrderDetailPinQu',
    	method:'post'
    },
    'findOrderDetaiAll':{
    	url:'/detail/findOrderDetaiAll',
    	method:'post'
    },
    'sellReportDetailForBranch':{
    	url:'/detail/sellReportDetailForBranch',
    	method:'post'
    },
    'findOrderDetailAll':{
    	url:'/benReportDetail/findOrderDetail',
    	method:'post'
    },
    'saleReportDetailForBranch':{
    	url:'/benReportDetail/saleReportDetailForBranch',
    	method:'post'
    },
    'saleReportDetailForBranch':{
    	url:'/benReportDetail/saleReportDetailForBranch',
    	method:'post'
    },
    'findOrderDetailPinQuSome':{
    	url:'/pinQuReportDetail/findOrderDetailPinQu',
    	method:'post'
    },
    'updatePayChannel':{
    	url:'/detail/updatePayChannel',
    	method:'post'
    },
    'updatePayChannelPian':{
    	url:'/pinQuReportDetail/updatePayChannel',
    	method:'post'
    }
    
}
export default config;
