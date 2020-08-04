<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Commodity Management</el-breadcrumb-item>
      <el-breadcrumb-item>Parameter List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="Note: Only relevant parameters can be set for the third level classification"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <el-row class="selectProCate">
        <el-col>
          <span>Select product category:</span>
          <el-cascader
            v-model="selectedCategory"
            :options="cateList"
            :props="categoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="Dynamic parameters" name="many">
          <el-button
            :disabled="islocked"
            type="primary"
            class="parambutton"
            @click="addPOrPVisible = true"
          >Add Parameters</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- first column expand feature -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- second column index column -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- third column parameter name column -->
            <el-table-column prop="attr_name" label="Parameter Name"></el-table-column>
            <!-- fourth column option column -->
            <el-table-column label="Options">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditForm(scope.row.attr_id)"
                >Edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletePOrP(scope.row.attr_id)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Static properties" name="only">
          <el-button
            :disabled="islocked"
            type="primary"
            class="parambutton"
            @click="addPOrPVisible = true"
          >Add properties</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <!-- first column expand feature -->
             <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- second column index column -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- third column parameter name column -->
            <el-table-column prop="attr_name" label="Attribute Name"></el-table-column>
            <!-- fourth column option column -->
            <el-table-column label="Options">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditForm(scope.row.attr_id)"
                >Edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletePOrP(scope.row.attr_id)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- add parameters dialog -->
    <el-dialog
      :title="'Add '+titleForAdd"
      :visible.sync="addPOrPVisible"
      width="25%"
      @close="addDialogClose"
    >
      <el-form :model="addFormData" :rules="addFormDataRules" ref="addFormDataRef">
        <el-form-item :label="titleForAdd" prop="attr_name">
          <el-input v-model="addFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPOrPVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addPOrP">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- edit parameter dialog -->
    <el-dialog
      :title="'Edit '+titleForAdd"
      :visible.sync="editPOrPVisible"
      width="25%"
      @close="editDialogClose"
    >
      <el-form :model="editFormData" :rules="editFormDataRules" ref="editFormDataRef">
        <el-form-item :label="titleForAdd" prop="attr_name">
          <el-input v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPOrPVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editPOrP">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
export default {
  data: function () {
    return {
      cateList: [],
      categoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedCategory: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addPOrPVisible: false,
      editPOrPVisible: false,
      addFormData: {
        attr_name: ''
      },
      addFormDataRules: {
        attr_name: [
          {
            required: true, message: 'Please input parameter name', trigger: 'blur'
          }
        ]
      },
      editFormData: {
        attr_name: ''
      },
      editFormDataRules: {
        attr_name: [
          {
            required: true, message: 'Please input parameter name', trigger: 'blur'
          }
        ]
      }
    }
  },
  created: function () {
    this.getCateList()
  },
  computed: {
    islocked: function () {
      if (this.selectedCategory.length === 3) {
        return false
      } else {
        return true
      }
    },
    levelThreeID: function () {
      if (this.selectedCategory.length === 3) {
        return this.selectedCategory[2]
      } else {
        return null
      }
    },
    titleForAdd: function () {
      if (this.activeName === 'many') {
        return 'Parameters'
      } else {
        return 'Properties'
      }
    }
  },
  methods: {
    getCateList: async function () {
      const { data: res } = await Vue.axios.get('categories/')
      if (res.meta.status === 200) {
        this.cateList = res.data
      } else {
        this.$message.error('request products category list failed')
      }
    },
    handleChange: function () {
      this.getParamsData()
    },
    handleTabClick: function () {
      this.getParamsData()
    },
    getParamsData: async function () {
      if (this.selectedCategory.length === 3) {
        const { data: res } = await Vue.axios.get(`categories/${this.levelThreeID}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status === 200) {
          //   console.log(res.data)
        } else {
          return this.$message.error('request parameters list failed')
        }
        // console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      } else {
        this.selectedCategory = []
        this.manyTableData = []
        this.onlyTableData = []
      }
    },
    addDialogClose: function () {
      this.$refs.addFormDataRef.resetFields()
    },
    editDialogClose: function () {
      this.$refs.editFormDataRef.resetFields()
    },
    addPOrP: async function () {
      this.$refs.addFormDataRef.validate(
        async (result) => {
          if (result) {
            const { data: dataReceived } = await Vue.axios.post(`categories/${this.levelThreeID}/attributes`, { attr_name: this.addFormData.attr_name, attr_sel: this.activeName })
            if (dataReceived.meta.status !== 201) {
              this.$message.error('Add Parameter Failed')
            } else {
              this.$message.success('Add Parameter Successed')
              this.getParamsData()
              this.addPOrPVisible = false
            }
          } else {
            return false
          }
        }
      )
    },
    showEditForm: async function (Id) {
      const { data: dataReceived } = await Vue.axios.get(`categories/${this.levelThreeID}/attributes/${Id}`, { params: { attr_sel: this.activeName } })
      if (dataReceived.meta.status !== 200) {
        this.$message.error('Access Parameter Failed')
      } else {
        this.editFormData = dataReceived.data
      }
      this.editPOrPVisible = true
    },
    editPOrP: async function () {
      this.$refs.editFormDataRef.validate(
        async (result) => {
          if (result) {
            const { data: dataReceived } = await Vue.axios.put(`categories/${this.levelThreeID}/attributes/${this.editFormData.attr_id}`, { attr_name: this.editFormData.attr_name, attr_sel: this.activeName })
            if (dataReceived.meta.status !== 200) {
              this.$message.error('Edit Parameter Failed')
            } else {
              this.$message.success('Edit Parameter Successed!')
              this.getParamsData()
              this.editPOrPVisible = false
            }
          } else {
            return false
          }
        }
      )
    },
    deletePOrP: function (id) {
      this.$confirm('This operation will permanently delete this parameter, want to continue?', 'Note', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        const { data: dataReceived } = await Vue.axios.delete(`categories/${this.levelThreeID}/attributes/${id}`, { params: { attr_sel: this.activeName } })
        if (dataReceived.meta.status !== 200) {
          this.$message.error('Delete Parameter Failed')
        } else {
          this.$message.success('Deleted Successed')
          this.getParamsData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    },
    handleInputConfirm: function (row) {
      if (row.inputValue.trim().length > 0) {
        row.attr_vals.push(row.inputValue.trim())
        this.saveTagChanges(row)
      }
      row.inputValue = ''
      row.inputVisible = false
    },
    saveTagChanges: async function (row) {
      const { data: dataReceived } = await Vue.axios.put(`categories/${this.levelThreeID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      if (dataReceived.meta.status !== 200) {
        this.$message.error('Edit Tag Failed')
      } else {
        this.$message.success('Edit Tag Successed')
      }
    },
    showInput: function (rowData) {
      rowData.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    deleteTag: function (index, dataSource) {
      dataSource.attr_vals.splice(index, 1)
      this.saveTagChanges(dataSource)
    }
  }
}</script>

<style lang="scss" scoped>
.selectProCate {
  margin: 15px 0;
}

.parambutton {
  margin-bottom: 15px;
}
.el-table__expanded-cell span {
  margin-right: 10px;
}
.input-new-tag {
  width: 130px;
}
</style>
