<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Order Management</el-breadcrumb-item>
      <el-breadcrumb-item>Order List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="Please input the content" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="Order number"></el-table-column>
        <el-table-column prop="order_price" label="Order Price(RMB)" width="150px"></el-table-column>
        <el-table-column prop="order_status" label="Whether paid" width="105px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">Paid</el-tag>
            <el-tag v-else type="danger">Unpaid</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="Whether Shipped" width="130px"></el-table-column>
        <el-table-column prop="create_time" label="Order Time" width="140px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="Options" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editOrderById(scope.row.goods_id)"
              size="small"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="checkShippmentProcessById(scope.row.goods_id)"
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
        :total="totalOrders"
        background
      ></el-pagination>
    </el-card>

    <!-- edit shippment address -->
    <el-dialog title="Edit Address" :visible.sync="editAddressdialogVisible" width="50%">
      <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef">
        <el-form-item label="省市区/县" prop="region">
          <el-cascader
            v-model="editAddressForm.region"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="Detail Address" prop="address">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressdialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editAddressdialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- check shippment process -->
    <el-dialog
      title="Shippment Progress"
      :visible.sync="shippmentProcessdialogVisible"
      width="40%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import cityData from './citydata'
import Vue from 'vue'
export default {
  data: function () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totalOrders: 0,
      ordersList: [],
      editAddressdialogVisible: false,
      shippmentProcessdialogVisible: false,
      editAddressForm: {
        region: [],
        address: ''
      },
      editAddressFormRules: {
        region: [{ required: true, message: 'Region must be specified', trigger: 'blur' }],
        address: [{ required: true, message: 'Detail address must be specified', trigger: 'blur' }]
      },
      cityData: cityData,
      progressInfo: []
    }
  },
  created: function () {
    this.getOrdersList()
  },
  methods: {
    getOrdersList: async function () {
      const { data: res } = await Vue.axios.get('orders', { params: this.queryInfo })
      if (res.meta.status === 200) {
        // console.log(res.data)
        this.totalOrders = res.data.total
        this.ordersList = res.data.goods
      } else {
        this.$message.error('failed to request orders list')
      }
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    editOrderById: async function (id) {
      this.editAddressdialogVisible = true
      const { data: res } = await Vue.axios.delete('goods', { params: this.queryInfo })
      if (res.meta.status === 200) {
        // console.log(res.data)
        this.totalProductsNum = res.data.total
        this.productsList = res.data.goods
      } else {
        this.$message.error('failed to request products')
      }
    },
    closeEditAddressdialog: function () {
      this.editAddressdialogVisible = false
      this.$refs.editAddressFormRef.resetFields()
    },
    checkShippmentProcessById: async function () {
      this.shippmentProcessdialogVisible = true
      const { data: res } = await Vue.axios.get('/kuaidi/804909574412544580')
      if (res.meta.status === 200) {
        console.log(res.data)
        this.progressInfo = res.data
      } else {
        this.$message.error('failed to access shippment progress')
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
