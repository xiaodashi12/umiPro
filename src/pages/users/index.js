import Link from 'umi/link'
import styles from './index.css';

export default function() {
  const userList=[
    {id:1,name:"tom"},
    {id:2,name:"jerry"}
  ]
  return (
    <div className={styles.normal}>
      <h1>用户users下的index页面</h1>
      <ul>
        {userList.map(
          val=>(
            <li key={val.id}>
              <Link to={`/users/${val.name}`}>
              {val.name}
              </Link>
            </li>
          )
        )}
        
      </ul>
    </div>
  );
}