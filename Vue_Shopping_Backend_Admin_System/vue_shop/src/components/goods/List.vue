<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Commodity Management</el-breadcrumb-item>
      <el-breadcrumb-item>Product List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="Please input the content"
            v-model="queryInfo.query"
            clearable
            @click="getGoodsList"
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">Add Product</el-button>
        </el-col>
      </el-row>

      <el-table :data="productsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="Product Name"></el-table-column>
        <el-table-column prop="goods_price" label="Product Price(RMB)" width="150px"></el-table-column>
        <el-table-column prop="goods_weight" label="Product Weight" width="120px"></el-table-column>
        <el-table-column prop="add_time" label="Created Time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="Options" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editProductById(scope.row.goods_id)"
              size="small"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="deleteProductById(scope.row.goods_id)"
              size="small"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalProductsNum"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
export default {
  data: function () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      productsList: [],
      totalProductsNum: 0
    }
  },
  created: function () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList: async function () {
      const { data: res } = await Vue.axios.get('goods', { params: this.queryInfo })
      if (res.meta.status === 200) {
        // console.log(res.data)
        this.totalProductsNum = res.data.total
        this.productsList = res.data.goods
      } else {
        this.$message.error('failed to request products')
      }
    },
    goAddpage: function () {
      this.$router.push('/goods/add')
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    deleteProductById: async function (id) {
      this.$confirm('This operation will permanently delete the product, do you want to continue?', 'Note', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await Vue.axios.delete('goods/' + id)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: 'Deleted!'
          })
          console.log(res.data)
        } else {
          this.$message.error('failed to delete this product')
        }
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    },
    editProductById: async function (id) {
      const { data: res } = await Vue.axios.delete('goods', { params: this.queryInfo })
      if (res.meta.status === 200) {
        console.log(res.data)
        this.totalProductsNum = res.data.total
        this.productsList = res.data.goods
      } else {
        this.$message.error('failed to request products')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin: 15px 0;
}
</style>
