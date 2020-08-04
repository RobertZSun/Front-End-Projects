<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">User Admin</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">User List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card sectiopn -->
    <el-card class="box-card">
      <!-- input and search section -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="please input"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">
            <i class="fas fa-plus-circle"></i>Add User
          </el-button>
        </el-col>
      </el-row>

      <!-- user table section -->
      <el-table :data="receivedUserList" style="width: 100%" :border="true" :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="Username"></el-table-column>
        <el-table-column prop="email" label="Email" width="249"></el-table-column>
        <el-table-column prop="mobile" label="Tel"></el-table-column>
        <el-table-column prop="role_name" label="Role" width="190"></el-table-column>
        <el-table-column label="State">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Options">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="Adjust Role"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-user"
                circle
                size="small"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination section -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUsers"
      ></el-pagination>
    </el-card>

    <!-- add user dialog -->
    <el-dialog
      title="Add user"
      :visible.sync="dialogVisible"
      width="25%"
      @close="addUserDialogClose"
    >
      <el-form :model="addUserForm" status-icon :rules="addUserRules" ref="addUserFormRef">
        <el-form-item label="Username" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Tel" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- bottom buttons area -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogClose">Reset</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addUser">Submit</el-button>
      </span>
    </el-dialog>
    <!-- edit user dialog -->
    <el-dialog
      title="Edit User"
      :visible.sync="editUserDialogVisible"
      width="25%"
      @close="editDialogClosed"
    >
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef">
        <el-form-item label="Username">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Tel" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateUser(editUserForm.id)">Update</el-button>
      </span>
    </el-dialog>
    <!-- assign roles -->
    <el-dialog
      class="assign-roles-dialog"
      title="Assigning Roles"
      :visible.sync="assignRightsDialogVisible"
      width="30%"
      @close="setRoleClose"
    >
      <div>
        <el-row style="margin-bottom: 15px;">
          <el-col :span="5">
            <b>Current User:</b>
          </el-col>
          <el-col :span="19">
            <span>{{userInfo.username}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px;">
          <el-col :span="5">
            <b>Current Role:</b>
          </el-col>
          <el-col :span="19">
            <span>{{userInfo.role_name}}</span>
          </el-col>
        </el-row>
        <p>
          <b>Assign new Role:</b>
          <span>
            <el-select v-model="selectedRoleId" placeholder="Select roles">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightsDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveRoleInfo">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<i class="fas fa-plus-circle"></i>
<script type="text/javascript">
import Vue from 'vue'

export default {
  data: function () {
    var validateEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        callback()
      } else {
        callback(new Error('Please input a valid email address'))
      }
    }
    var validateTel = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error('Please input a valid cellphone number'))
      }
    }
    return {
      receivedUserList: [],
      totalUsers: 0,
      queryInfo: {
        query: '',
        pagenum: 1, // current page number
        pagesize: 2 // how many items listed per current page
      },
      dialogVisible: false,
      editUserDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignRightsDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: '',
      addUserRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 3, max: 16, message: 'username should be 3 ~ 16 characters', trigger: 'blur' }
        ],
        password: [
          { min: 3, max: 16, message: 'password should be 3 ~ 16 characters', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please input cellphone number', trigger: 'blur' },
          { min: 6, max: 11, message: 'cell phone number up to 11 digits', trigger: 'blur' },
          { validator: validateTel, trigger: 'blur' }
        ]
      },
      editUserRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please input cellphone number', trigger: 'blur' },
          { min: 6, max: 11, message: 'cell phone number up to 11 digits', trigger: 'blur' },
          { validator: validateTel, trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getUserList()
  },
  methods: {
    getUserList: async function () {
      const { data: dataReceived } = await Vue.axios.get('users', { params: this.queryInfo })
      //   console.log(dataReceived)
      if (dataReceived.meta.status !== 200) {
        this.$message.error(dataReceived.meta.msg)
      } else {
        this.receivedUserList = dataReceived.data.users
        this.totalUsers = dataReceived.data.total
      }
    },
    // when pagesize changed
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // when page changed
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    userStateChanged: async function (val) {
      const id = val.id
      const type = val.mg_state

      const { data: response } = await Vue.axios.put(`users/${id}/state/${type}`, {})
      if (response.meta.status !== 200) {
        this.$message.error(response.meta.msg)
        val.val.mg_state = !type
      } else {
        this.$message.success(response.meta.msg)
      }
    },
    addUser: function () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await Vue.axios.post('users', this.addUserForm)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
          this.dialogVisible = false
        } else {
          this.$message.error('does not meet the requirements, failed to add the user')
        }
        this.getUserList()
      })
    },
    addUserDialogClose: function () {
      this.$refs.addUserFormRef.resetFields()
    },
    showEditDialog: async function (id) {
      this.editUserDialogVisible = true
      const { data: res } = await Vue.axios.get('users/' + id)
      if (res.meta.status === 200) {
        this.editUserForm = res.data
        console.log(this.editUserForm)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    editDialogClosed: function () {
      this.$refs.editUserFormRef.resetFields()
    },
    updateUser: function (id) {
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await Vue.axios.put('users/' + id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
          this.editUserDialogVisible = false
        } else {
          this.$message.error('does not meet the requirements, failed to update the user')
        }
        this.getUserList()
      })
    },
    deleteUserById: async function (id) {
      // console.log(id)
      //   double confirm
      await this.$confirm('This operation will permanently delete this user, do you want to continue?', 'Attention', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await Vue.axios.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: 'Delete Successed!'
          })
        } else {
          this.$message.error('Delete Error')
        }
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete Canceled'
        })
      })
    },
    setRole: async function (data) {
      this.userInfo = data
      const { data: res } = await Vue.axios.get('roles')
      if (res.meta.status === 200) {
        this.rolesList = res.data
      } else {
        this.$message.error('roles request failed')
      }
      this.assignRightsDialogVisible = true
      console.log(data)
    },
    saveRoleInfo: async function () {
      if (this.selectedRoleId) {
        const { data: res } = await Vue.axios.put('users/' + this.userInfo.id + '/role', { rid: this.selectedRoleId })
        if (res.meta.status === 200) {
          this.$message.success('new role assigned')
        } else {
          this.$message.error('new role assigned failed')
        }
        this.assignRightsDialogVisible = false
        this.getUserList()
      } else {
        this.$message.error('please assign a role')
      }
    },
    setRoleClose: function () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}

</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.el-col {
  border-radius: 4px;
}
.fa-plus-circle {
  margin-right: 8px;
}

.el-table {
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 12px;
}

.assign-roles-dialog {
  text-align: left;
}
</style>
