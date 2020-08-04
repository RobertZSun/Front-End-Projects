<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >Rights Admin</el-breadcrumb-item>
      <el-breadcrumb-item >Rights List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="Authority Name" width="180"></el-table-column>
        <el-table-column prop="path" label="Route" width="180"></el-table-column>
        <el-table-column prop="level" label="Permission level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">Level 2</el-tag>
            <el-tag type="warning" v-else>Level 3</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'

export default {
  data: function () {
    return {
      rightsList: []
    }
  },
  created: function () {
    this.getRightsList()
  },
  methods: {
    getRightsList: async function () {
      const { data: res } = await Vue.axios.get('rights/list')
      if (res.meta.status === 200) {
        this.rightsList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
