//维护页面数据的对象
import axios from 'axios'
//掉接口本来应该写在sevice层，但是由于演示，所以先放在model
function getGoods(){
    return axios.get('/api/goods')
}

export default{
    namespace:"goods",//model的命名空间，区分多个model
    state:[],//初始状态
    effects:{//异步操作
        *getList(action,{call,put}){
            const res=yield call(getGoods);//调用上面的异步方法
            yield put({type:'initGoods',payload:res.data.result})//将数据派发出去
        }
    },
    reducers:{//派发上面的action触发reducers
        initGoods(state,action){
            return action.payload;//将我们的数据更新给state所以state就会有数据
        },
        //添加商品
        addGood(state,action){
            return [...state,{title:action.payload.title}];//将我们的数据更新给state所以state就会有数据
        }
    }

};