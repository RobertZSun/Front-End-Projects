<template>
  <el-container class="home-container">
    <!-- header part -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo" />
        <span>E-commerce Backend Management System</span>
      </div>
      <el-row>
        <el-button type="info" @click="logout">Logout</el-button>
      </el-row>
    </el-header>
    <!-- main body part -->
    <el-container>
      <!-- left part which is aside part -->
      <el-aside :width="collapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="collapsed"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :key="item.id" :index="item.id+''" v-for="item in asideMenuData">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item
              :key="item_item.id"
              :index="'/'+item_item.path"
              v-for="item_item in item.children"
              @click="hightlightState('/'+item_item.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{item_item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- right part which is content display part -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/javascript">
import Vue from 'vue'

export default {
  data: function () {
    return {
      asideMenuData: [],
      iconObj: {
        125: 'fas fa-user-friends',
        103: 'fas fa-cubes',
        101: 'fas fa-store',
        102: 'fas fa-tasks',
        145: 'fas fa-chart-line'
      },
      collapsed: false,
      activePath: ''
    }
  },
  created: function () {
    this.getMenuContent()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout: function () {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
      this.$router.push('/login')
    },
    getMenuContent: async function () {
      const { data: response } = await Vue.axios.get('menus')
      // console.log(response)
      // console.log(response.data)
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.msg)
      } else {
        this.asideMenuData = response.data
      }
    },
    toggleCollapse: function () {
      this.collapsed = !this.collapsed
    },
    hightlightState: function (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
$headerBGC: #373d41;
$asideBGC: #333744;
$contentBGC: #eaedf1;

.home-container {
  height: 100%;
}

.el-header {
  background-color: $headerBGC;
  display: flex;
  justify-content: space-between;
  color: #fff;
  align-items: center;
  font-size: 26px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 50px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: $asideBGC;
  color: #fff;
  text-align: left;
  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #4a5064;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
  cursor: pointer;
}

.el-main {
  background-color: $contentBGC;
  color: rgb(20, 19, 19);
  // text-align: center;
}

.svg-inline--fa {
  margin-right: 10px;
}
</style>
