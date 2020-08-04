<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Commodity Management</el-breadcrumb-item>
      <el-breadcrumb-item>Add Product</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-alert title="Add Product Information" type="info" center show-icon :closable="false"></el-alert>
      </el-row>
      <el-row style="margin: 15px 0;">
        <el-steps :space="200" :active="currentStep - 0" finish-status="success" align-center>
          <el-step title="Basic Information"></el-step>
          <el-step title="Product Parameters"></el-step>
          <el-step title="Commodity Attributes"></el-step>
          <el-step title="Product Photo"></el-step>
          <el-step title="Product Content"></el-step>
          <el-step title="Completed"></el-step>
        </el-steps>
      </el-row>
      <el-form
        :model="basicInfoForm"
        :rules="basicInfoFormRules"
        ref="basicInfoFormRef"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="currentStep"
          :before-leave="beforeTabLeave"
          @tab-click="clickonTab"
        >
          <el-tab-pane name="0" label="Basic Info">
            <el-form-item label="Product Name" prop="goods_name">
              <el-input v-model="basicInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="Product Price" prop="goods_price">
              <el-input v-model="basicInfoForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Product Weight" prop="goods_weight" type="number">
              <el-input v-model="basicInfoForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="Product Number" prop="goods_number">
              <el-input v-model="basicInfoForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Product Categories" prop="goods_category">
              <el-cascader
                v-model="basicInfoForm.goods_cat"
                placeholder="Please Select"
                :options="categoriesList"
                :props="cascaderConfig"
                prop="goods_cat"
                @change="handleSelectChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="Product Parameters">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="str"
                  :key="index"
                  v-for="(str, index) in item.attr_vals"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="Product Properties">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="Product Photo">
            <el-upload
              :action="photoUploadURL"
              :on-preview="handlePreview"
              :on-remove="deletePic"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadedSuccess"
            >
              <el-button size="small" type="primary">Click to Upload</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >Only jpg/png files can be uploaded, and no more than 500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="Product Content">
            <quill-editor ref="myQuillEditor" v-model="basicInfoForm.goods_introduce" />
            <el-button class="add-button" size="small" type="primary" @click="addPro">Add Product</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="Photo Preview" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
import _ from 'lodash'
export default {
  data: function () {
    return {
      currentStep: '0',
      categoriesList: [],
      basicInfoForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: '',
        goods_introduce: '',
        goods_cat: [],
        attrs: [],
        pics: []
      },
      basicInfoFormRules: {
        goods_name: [{ required: true, message: 'Product is Required', trigger: 'blur' }],
        goods_price: [{ required: true, message: 'Product price is Required', trigger: 'blur' }],
        goods_weight: [{ required: true, message: 'Product weight is Required', trigger: 'blur' }],
        goods_number: [{ required: true, message: 'Product amount is Required', trigger: 'blur' }],
        goods_cat: [{ required: true, message: 'Product select a category', trigger: 'blur' }]
      },
      cascaderConfig: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyTableData: [],
      onlyTableData: [],
      photoUploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      pics: [],
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      previewURL: '',
      previewVisible: false
    }
  },
  created: function () {
    this.getCateList()
  },
  computed: {
    levelThreeID: function () {
      if (this.basicInfoForm.goods_cat.length === 3) {
        return this.basicInfoForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    getCateList: async function () {
      const { data: res } = await Vue.axios.get('categories')
      if (res.meta.status === 200) {
        // console.log(res.data)
        this.categoriesList = res.data
      } else {
        this.$message.error('failed to request products')
      }
    },
    handleSelectChange: function () {
      if (this.basicInfoForm.goods_cat.length === 3) {

      } else {
        this.basicInfoForm.goods_cat = []
      }
    },
    beforeTabLeave: function (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.basicInfoForm.goods_cat.length !== 3) {
        this.$message.error('Please select a category which must down to level 3')
        return false
      }
    },
    clickonTab: async function () {
      //   console.log(this.currentStep)
      switch (this.currentStep) {
        case '0': {
          console.log('Product Params')
          break
        }
        case '1': {
          const { data: res } = await Vue.axios.get(`categories/${this.levelThreeID}/attributes`, { params: { sel: 'many' } })
          if (res.meta.status === 200) {
            console.log(res.data)
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
            })
            this.manyTableData = res.data
          } else {
            this.$message.error('failed to request dynamic parameter')
          }
          break
        }
        case '2': {
          const { data: res } = await Vue.axios.get(`categories/${this.levelThreeID}/attributes`, { params: { sel: 'only' } })
          if (res.meta.status === 200) {
            console.log(res.data)
            this.onlyTableData = res.data
          } else {
            this.$message.error('failed to request static properties')
          }
          break
        }
      }
    },
    handlePreview: function (file) {
      this.previewURL = file.response.data.url
      this.previewVisible = true
    },
    uploadedSuccess: function (response) {
      const picInfo = { pic: response.data.tem_path }
      this.basicInfoForm.pics.push(picInfo)
    },
    deletePic: function (file) {
      const filePath = file.response.data.tem_path
      const index = this.basicInfoForm.pics.findIndex(item => {
        return item.pic === filePath
      })
      this.basicInfoForm.pics.splice(index, 1)
    },
    addPro: function () {
      this.$refs.basicInfoFormRef.validate(
        async (result) => {
          if (result) {
            const form = _.cloneDeep(this.basicInfoForm)
            form.goods_cat = form.goods_cat.join(',')
            this.manyTableData.forEach(item => {
              const newTempInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
              this.basicInfoForm.attrs.push(newTempInfo)
            })
            this.onlyTableData.forEach(item => {
              const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
              this.basicInfoForm.attrs.push(newInfo)
            })
            form.attrs = this.basicInfoForm.attrs
            const { data: dataReceived } = await Vue.axios.post('goods', form)
            if (dataReceived.meta.status !== 201) {
              this.$message.error('Add Product Failed')
            } else {
              this.$message.success('Add Product Successed')
              this.$router.push('/goods')
            }
          } else {
            this.$message.error('Please fill in the necessary form items')
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0;
}
.preview-img {
  width: 100%;
}

/deep/ .ql-editor {
  min-height: 300px;
}
.add-button {
  margin-top: 15px;
}
</style>
