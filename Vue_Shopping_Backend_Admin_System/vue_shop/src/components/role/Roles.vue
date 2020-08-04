<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Rights Admin</el-breadcrumb-item>
      <el-breadcrumb-item>Roles List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- add role section -->
      <el-row>
        <el-col>
          <el-button type="primary">
            <i class="fas fa-plus-circle"></i> Add Role
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['borderBelow', 'verticalCenter', index === 0 ? 'borderAbove':'']"
              v-for="(ele, index) in scope.row.children"
              :key="ele.id"
            >
              <!-- level 1 -->
              <el-col :span="5">
                <el-tag :closable="true" @close="removeRightById(scope.row,ele.id)">{{ele.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- level 2 & 3-->
              <el-col :span="19">
                <el-row
                  :class="['verticalCenter', subIndex !== 0 ? 'borderAbove':'']"
                  v-for="(subEle, subIndex) in ele.children "
                  :key="subEle.id"
                >
                  <!-- level 2 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      :closable="true"
                      @close="removeRightById(scope.row,subEle.id)"
                    >{{subEle.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- level 3 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(secondaryEle) in subEle.children"
                      :key="secondaryEle.id"
                      :closable="true"
                      @close="removeRightById(scope.row,secondaryEle.id)"
                    >{{secondaryEle.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="Role Name"></el-table-column>
        <el-table-column prop="roleDesc" label="Role Description"></el-table-column>
        <el-table-column label="Options" width="350px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">Edit</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">Delete</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="settingRights(scope.row)"
            >Assign Permissions</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- assign rights -->
    <el-dialog
      @close="assignRightsClose"
      title="Assign Permissions"
      :visible.sync="assignRightsDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        :props="rightsTreeProps"
        :default-expand-all="true"
        node-key="id"
        show-checkbox
        :default-checked-keys="defKeys"
        ref="rightsTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightsDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="getAllChecked">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'

export default {
  data: function () {
    return {
      roleList: [],
      assignRightsDialogVisible: false,
      rightsList: [],
      rightsTreeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created: function () {
    this.getRolesList()
  },
  methods: {
    getRolesList: async function () {
      const { data: res } = await Vue.axios.get('roles')
      this.roleList = res.data
    },
    removeRightById: async function (role, rId) {
      await this.$confirm('This operation will permanently remove the permission, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        console.log(role, rId)
        const { data: res } = await Vue.axios.delete('roles/' + role.id + '/rights/' + rId)
        console.log(res)
        if (res.meta.status === 200) {
          role.children = res.data
        } else {
          this.$message.error('failed to delete')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    },
    settingRights: async function (node) {
      this.roleId = node.id
      const { data: res } = await Vue.axios.get('rights/tree')
      if (res.meta.status === 200) {
        this.getAllLeaves(node, this.defKeys)
        this.rightsList = res.data
        this.assignRightsDialogVisible = true
      } else {
        this.$message.error('failed to request rights')
      }
    },
    getAllLeaves: function (node, arr) {
      if (node.children) {
        node.children.forEach(item => this.getAllLeaves(item, arr))
      } else {
        arr.push(node.id)
      }
    },
    assignRightsClose: function () {
      this.defKeys = []
    },
    getAllChecked: async function () {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await Vue.axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status === 200) {
        this.$message.success('rights updated success')
      } else {
        this.$message.error('failed to update rights')
      }
      this.assignRightsDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}

.el-tag {
  margin: 7px;
}

.borderAbove {
  border-top: 1px solid #eee;
}

.borderBelow {
  border-bottom: 1px solid #eee;
}

.verticalCenter {
  display: flex;
  align-items: center;
}
</style>
