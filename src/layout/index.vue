<template>
  <div class="wrap">
    <div class="side">
      <nav class="nav">
        <div class="tg" title="显示|隐藏" @click="toggleNav">
          <span><i class="el-icon-s-fold"/></span>
        </div>
        <div v-show="isNavVisible">
          <div
            v-for="(item,idx) in list"
            :key="idx"
          >
            <template v-if="item.name">
              <div
                class="g"
                @click="focusGroup(idx)"
              >
                {{ item.name }}
                <i :class="[isExpand(idx)? 'el-icon-arrow-down': 'el-icon-arrow-up']" />
              </div>
              <div v-show="isExpand(idx)">
                <ul>
                  <li
                    v-for="(subItem,index) in item.children"
                    :key="index"
                  >
                    <div>
                      <router-link :to="subItem.path">
                        <div class="t">
                          {{ subItem.name }}
                        </div>
                        <div class="d">
                          <p>
                            {{ subItem.desc }}
                          </p>
                        </div>
                        <i
                          v-if="subItem.meta && subItem.meta.recommend"
                          class="iconfont recommend"
                        />
                      </router-link>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </nav>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isNavVisible: true,
      curGroupId: 1,
      curGroupOpen: true
    }
  },
  computed: {
    list () {
      console.log(this.$router.options.routes)
      return this.$router.options.routes
    }
  },
  methods: {
    // 当前面板是否展开
    isExpand (val) {
      return this.curGroupId === val && this.curGroupOpen
    },
    // 聚焦导航菜单组
    focusGroup (val) {
      if (this.curGroupId === val) {
        this.curGroupOpen = !this.curGroupOpen
      } else {
        this.curGroupOpen = true
      }
      this.curGroupId = val
    },
    // 显示隐藏导航
    toggleNav () {
      this.isNavVisible = !this.isNavVisible
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.wrap{
  display: flex;
  min-height: 100%;
  flex-direction: row;
  .side{
    position: relative;
    width: 260px;
    border-right: 1px solid #ccc;
  }
  .main{
    position: relative;
    flex: 1;
    background-color: #fff;
  }
}

.nav{
  position: absolute;
  top:0em;
  left:0em;
  z-index: 999;
  width: 260px;
  /*box-shadow:0 0 5px rgba(0,0,0,0.4);*/

  .tg{
    padding: 5px;
    text-align: left;
    background-color: #2f89ef;
    color: #ffffff;
    cursor: pointer;
  }
  .g{
    position: relative;
    padding: .5em 0.6em;
    text-align: left;
    background-color: #f0f0f0;
    border-bottom: 1px dotted #ccc;
    cursor: pointer;

    i{
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  ul{
    background-color: #ffffff;
  }
  li{}
  li:last-child{
    a {
      border:0 none;
    }
  }
  a{
    position: relative;
    display: block;
    padding: 0.5em 1em;
    color: #37485d;
    text-align: left;
    border-bottom: 1px dotted #ccc;
    .t{
      font-weight: bold;
    }
    .d{
      margin: 0;
      color: #677a84;
    }
    .recommend{
      position: absolute;
      top: -1px;
      left:0;
      color: #5daf34;
      font-size: 24px;
    }

    &:hover{
      background-color:  #37485d;
      color: #fff;
    }
  }
}
</style>
