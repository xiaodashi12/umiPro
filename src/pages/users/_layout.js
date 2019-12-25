
import styles from './_layout.css';

export default function(props) {
  return (
    <div className={styles.normal}>
      <h1>Page _layout主页面</h1>
      <div>这个src下的子组件{props.children}</div>
    </div>
  );
}
