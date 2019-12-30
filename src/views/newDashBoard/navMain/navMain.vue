<!--本页为tab标签-->
<template>
  <div>
      <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="item in editableTabs"
        ref="item"
        :key="item.name"
        :class="isActive(item.name)?'active':''"
        :to="{ path: item.name }"
        tag="span"
        class="tags-view-item"
        @click.prevent.native="handleClickTab(item.name)"
        @contextmenu.prevent.native="openMenu($event)"
      >
        {{ item.title }}
        <span v-if="item.name!='index'" class="el-icon-close" @click.prevent.stop="removeTab(item.name)"/>
      </router-link>
    </scroll-pane>
      <!-- <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
      @tab-click="handleClickTab($event.name)"
      @contextmenu.prevent.native="openMenu($event)"
    >
      <el-tab-pane
        :key="item.name"
        v-for="item in editableTabs"
        :label="item.title"
        :name="item.name"
        
      >
      </el-tab-pane>
    </el-tabs> -->
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag">刷新页面</li>
      <li v-if="editableTabsValue!='index'" @click="removeTab(editableTabsValue)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
  
</template>

<script>
import {plateMenuToListMap} from '@utils/dictionaries'
import ScrollPane from './ScrollPane'
export default {
  components: { ScrollPane },
  name: 'navMain',
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      plateMenuToListMap,
      editableTabsValue: 'index',
      editableTabs: [{
        title: '首页',
        name: 'index'
      }],
      tabIndex: 1,
      openedTab: ['index']
    }
  },
  methods: {
    isActive(route) {
      return route === this.editableTabsValue;
    },
    handleClickTab (route) {
      this.$store.commit('changeTab', route)
      this.$router.push(route)
    },
    closeOthersTags(){
      for(var i = this.openedTab.length-1;i >= 0;i--){
        if(this.openedTab[i] =='index' || this.openedTab[i] ==this.editableTabsValue+""){
          // debugger
          continue;
        }else{
          this.removeTab(this.openedTab[i])
        }
      }
    },
    closeAllTags(){
      for(var i = this.openedTab.length-1;i >= 0;i--){
        if(this.openedTab[i] !='index'){
          // debugger
          this.removeTab(this.openedTab[i])
        }
      }
      this.editableTabs= [{
        title: '首页',
        name: 'index'
      }];
      this.editableTabsValue='index';
      this.$router.push('index')
    },
    refreshSelectedTag(){
      debugger
      let pathName=this.editableTabsValue;
      // this.$store.commit('deductTab', pathName)
      // let deductIndex = this.openedTab.indexOf(pathName)
      // this.openedTab.splice(pathName, 1)
      this.$router.push(pathName)
      // console.log(this.editableTabsValue,"当前路由")
      // this.$router.push(this.editableTabsValue);
    },
    openMenu(e){
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX-15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = e.clientY-30;
        this.visible = true
        // this.selectedTag = tag
    },
    removeTab (targetName) {
      // 首页不允许被关闭（为了防止el-tabs栏中一个tab都没有）
      // if (targetName === 'index') {
      //   return false
      // }
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.$store.commit('deductTab', targetName)
      let deductIndex = this.openedTab.indexOf(targetName)
      this.openedTab.splice(deductIndex, 1)
      this.$router.push(activeName)
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      if (this.openedTab.length === 0) {
        this.$store.commit('addTab', 'index')
        this.$router.push('/index')
      }
    },
    closeMenu() {
      this.visible = false
    },
     //这个是一个样式封装接口，当右侧tab长度超过页面长度，左侧多出的tab会隐藏。最后一个tab会显示出来
     moveToCurrentTag() {
      const tags = this.$refs.item
      
      this.$nextTick(() => {
        tags.forEach((tag,idx)=>{
            if ("/"+tag.to.path === this.$route.path) {
              // debugger
              console.log(tag,"item")
              this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
            }
        })
      });
      
    },
  },
  computed: {
    getOpenedTab () {
      return this.$store.state.openedTab
    },
    changeTab () {
      return this.$store.state.activeTab
    }
  },
  watch: {
    $route() {
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    getOpenedTab (val) {
      if (val.length > this.openedTab.length) {
        // 添加了新的tab页
        // 导致$store.state中的openedTab长度
        // 大于
        // 标签页中的openedTab长度
        // 因此需要新增标签页
        let newTab = val[val.length - 1] // 新增的肯定在数组最后一个
        ++this.tabIndex
        this.editableTabs.push({
          title: plateMenuToListMap.get(newTab),
          name: newTab,
          content: ''
        })
        this.editableTabsValue = newTab
        this.openedTab.push(newTab)
      }
    },
    changeTab (val) {
      // 监听activetab以实现点击左侧栏时激活已存在的标签
      if (val !== this.editableTabsValue) {
        this.editableTabsValue = val
      }
    }
  },
  created () {
    // 刷新页面时（F11)
    // 因为<router-view>的<keep-alive>，会保留刷新时所在的router
    // 但是tab标签页因为刷新而被重构了，tab没有了
    // 因此需要将router回到index
    this.$router.push('index')
  }
}
</script>

<style scoped lang="scss">
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
