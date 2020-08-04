<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Commodity management</el-breadcrumb-item>
      <el-breadcrumb-item>Categories</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- add role section -->
      <el-row>
        <el-col class="add-Cate">
          <el-button type="primary" @click="showAddCateDialog">
            <i class="fas fa-plus-circle"></i> Add Category
          </el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="true"
        border
      >
        <!-- whether effect -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- sort -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">Level 1</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">Level 2</el-tag>
          <el-tag type="warning" size="mini" v-else>Level 3</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">Delete</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCategories"
      ></el-pagination>
    </el-card>
    <!-- add category dialog -->
    <el-dialog
      title="add category"
      :visible.sync="addCateDialogVisible"
      width="25%"
      @close="addCateDialogClosed"
    >
      <!-- add category form -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef">
        <el-form-item label="Category Name:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="Parent category:">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            placeholder="Please choose"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            class="cascader"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addCate">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
export default {
  data: function () {
    return {
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      cateList: [],
      parentCateList: [],
      totalCategories: 0,
      // 为table指定列的定义
      columns: [
        {
          label: 'Category Name',
          prop: 'cat_name'
        }, {
          label: 'Effective or not',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        }, {
          label: 'Sequence',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        }, {
          label: 'Operation',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: 'Please input category name', trigger: 'blur' }
        ]
      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandtrigger: 'hover',
        checkStrictly: true
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    }
  },
  created: function () {
    this.getGoodsCategories()
  },
  methods: {
    getGoodsCategories: async function () {
      const { data: res } = await Vue.axios.get('categories', { params: this.queryInfo })
      if (res.meta.status === 200) {
        this.cateList = res.data.result
        this.totalCategories = res.data.total
      } else {
        this.$message.error('failed to request categories')
      }
      //   console.log(this.cateList)
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCategories()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCategories()
    },
    showAddCateDialog: function () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCateDialogClosed: function () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    getParentCateList: async function () {
      const { data: res } = await Vue.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('request parent categories list failed！')
      }
      this.parentCateList = res.data
    },
    parentCateChanged: function () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate: function () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(
        async (result) => {
          if (result) {
            const { data: dataReceived } = await Vue.axios.post('categories', this.addCateForm)
            if (dataReceived.meta.status !== 201) {
              this.$message.error('Add Category Failed')
            } else {
              this.$message.success('Add Category Successed')
              this.getGoodsCategories()
              this.addCateDialogVisible = false
            }
          } else {
            return false
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-Cate,
.zk-table {
  margin-bottom: 15px;
}
.el-form-item__label {
  display: block !important;
  width: 150px;
}
</style>

<style>
.el-cascader-menu__wrap {
  height: 204px !important;
}
</style>
