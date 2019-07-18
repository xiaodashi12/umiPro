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
    }

}
export default config;
