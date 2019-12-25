import {connect} from 'dva'
import React,{Component} from 'react'
import styles from './goods.css';
import {Card,Button} from 'antd'
@connect(
  state=>({
    goodsList:state.goods,//获取指定model下的命名空间里面的state
    loading:state.loading//通过loading命名空间拿到我们的加载状态
  }),
  {
    getListed:()=>(
      {type:'goods/getList'}//action里面的type是需要命名空间为前缀+reducer(model下面的effects下的getList)
    ),
    addGooded:title=>(
      {
        type:'goods/addGood',
        payload:{title}
      }
    )
  }
)
export default class extends Component{
  componentDidMount(){
    this.props.getListed()
  }
  render(){
    if(this.props.loading.models.goods){//指定他的命名空间
      return(
        <div>
          loading...
        </div>
      )
    }
    return (
      <div className={styles.normal}>
        <h1>Page goods</h1>
        {/* 商品列表 */}
        <div>
          {this.props.goodsList.map((good,idx)=>{
            return (<Card title={`课程${idx+1}`} key={good.title}>
              <div>
                {good.title}
              </div>
            </Card>)
          })}
        </div>
        <div>
          <Button onClick={()=>this.props.addGooded('商品3'+new Date().getTime())}>
            添加商品
          </Button>
        </div>
      </div>
    );
  }
 
}