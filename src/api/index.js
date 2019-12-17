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
    }
}
export default config;
