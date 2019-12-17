import axios from 'axios'
import {Message} from 'element-ui'
import {getToken, getLocalStorage, setLocalStorage} from '@/utils/auth'
import store from '../store'
import * as dlgUtils from '../utils/dialogUtils'

const SUCCESS_CODE = 200;
import wsConsts from '@/utils/wsConsts'

// 创建axios实例
const service = axios.create({
//  baseURL: "http://172.18.61.4:10022/manager", // api的base_url
    // baseURL: "http://192.168.10.229:10025/manager", // api的base_url
    baseURL: "http://172.18.205.4:10021/manager",
    dataType:"json",
    headers:{
        'Content-Type':'application/json'
    },
    timeout: 30000 // 请求超时时间
})


// request拦截器
service.interceptors.request.use(config => {
    console.log(store.getters)
    if (store.getters.token) {
        config.headers.token = getToken();
    }


    if (config.method.toLowerCase() !== 'get' && Object.keys(config.data).length > 0) {
        let body = {};
        let data = {};

        for (let key in config.data) {
            if (key != 'method') {
                body[key] = config.data[key];
            }
        }
        data = body
        // if (getToken()) {
        //     data.ticket = getToken() || '';
        // }

        config.data = JSON.stringify(data)
    }

    return config
}, error => {
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
    if (!response.data) {
        return Promise.reject({code: "", message: '网络异常'});
    }
    const res = response.data;
    console.log(res)
    if (!res.hasOwnProperty('code')) {
        return res;
    }
    let expireTime = getLocalStorage('expireTime');
    if(res.code == 503){
        console.log(res)
        dlgUtils.loginTimeout()
        return Promise.reject({code: res.code, message: res.msg})
    }else if (res.code != 200){
    	console.log("not ---200")
   		return Promise.reject({code: res.code, message: res.msg})
    }
    else{
        setLocalStorage('expireTime', new Date().getTime() + 1000*60*60*24*7)
        return res;
    }

    return Promise.reject({code: res.code, message: res.msg})

}, error => {
    return Promise.reject({code: error.code, message: error.msg})
})
export default service



/**
 * 统一封装
 */
export function hsFetch(data,success,error){
	fetch(data).then(res => {
	            success(res)
	        }).catch(er => {
	        	if(error){
	        		error(er)
	        	}else{
		            this.endLoading()
		            this.$msgbox({
		                message:  error.message,
		                title: '失败',
		                customClass: 'my_msgBox singelBtn',
		                dangerouslyUseHTMLString: true,
		                confirmButtonText: '确定',
		                type: 'error'
		            })
	           }
	        })
}
