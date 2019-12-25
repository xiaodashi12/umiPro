
import styles from './_layout.css';
import {Button} from 'antd'
export default function(props) {
  return (
    <div className={styles.normal}>
      <h1>动态传值页面$name</h1>
      <p>详情页</p>
      <div>欢迎来到{props.match.params.name}</div>
      <Button onClick={()=>props.history.goBack()} type="primary">返回之前的路由</Button>
    </div>
  );
}
